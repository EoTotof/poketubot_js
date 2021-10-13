const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, entersState } = require('@discordjs/voice');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const MiniSearch = require('minisearch');
const { sliceString, toTitleCase } = require('../utils');

const executeSimpleDefineCommand = async (interaction, getter, embedGetter, model) => {
    const object = await getter(interaction.options.getString('name'));
    if (!object) {
        const suggestion = await getSuggestion({
            searchValue: interaction.options.getString('name'),
            model: model,
            fields: ['name'],
            storeFields: ['name'],
            displayFunction: ((result) => `"${result.name}"`),
        });

        let nothingFoundMessage = `Nothing found for "${interaction.options.getString('name')}"`;
        nothingFoundMessage += suggestion.length === 0 ? '' : `\nDid you mean ${suggestion.join(', ')}?`;

        await interaction.reply({
            embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
            ephemeral: true,
        });
    }
    else {
        await interaction.reply({
            embeds: [embedGetter(object)],
        });
    }
};

const executeSimpleRandomCommand = async (interaction, randomGetter, embedGetter) => {
    const object = await randomGetter();
    await interaction.reply({
        embeds: [embedGetter(object)],
    });
};

const executeCommandInteraction = async (isEphemeral, objects, timestamp, interaction, buttonsGetter, buttonsMessage, filter, onCollect) => {
    const buttons = buttonsGetter(objects, timestamp);

    const actionRows = [];

    for (let i = 0; i < buttons.length; i += 5) {
        actionRows.push(new MessageActionRow().addComponents(buttons.slice(i, i + 5)));
    }

    await interaction.reply({
        embeds: [new MessageEmbed().setDescription(buttonsMessage)],
        components: actionRows,
        ephemeral: isEphemeral,
    });

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', onCollect);

    collector.on('end', async (collected) => {
        if (collected.size == 0) {
            await interaction.editReply({
                embeds: [new MessageEmbed().setDescription('The command has expired.')],
                components: [],
            });
        }
    });
};

const getSuggestion = async ({ searchValue, model, fields, storeFields, displayFunction }) => {
    const objects = await model.findAll();
    const miniSearch = new MiniSearch({
        fields: fields,
        storeFields: storeFields,
    });
    miniSearch.addAll(objects);
    const results = miniSearch
        .search(searchValue, { fuzzy: 0.2 })
        .map(displayFunction);

    return [...new Set(results)]
        .slice(0, 3);
};

const addLongField = (fields, name, value) => {
    sliceString(value, 1024, '\n\n')
        .forEach((slice, index) => {
            const sliceName = index === 0 ? name : '\u200b';
            fields.push({ name: sliceName, value: slice });
        });
};

const addMegaButtons = (buttons, timestamp, pokemons, commandID) => {
    pokemons.forEach((pokemon) => {
        if (pokemon.mega_form) {
            pokemon.mega_form
                .split(',')
                .forEach((megaForm) => {
                    const form = pokemon.form_number ? `${pokemon.form_number}+${megaForm}` : megaForm;
                    const label = pokemon.form ? `${pokemon.form} - ${toTitleCase(megaForm, '_')}` : toTitleCase(megaForm, '_');
                    buttons.push(
                        new MessageButton()
                            .setCustomId(`${timestamp}-${commandID}-${pokemon.number}-${form}`)
                            .setLabel(label)
                            .setStyle('PRIMARY'),
                    );
                });
        }
    });
};

const getLastPlaytestVersion = (objects) => {
    for (const version of ['[SwSh]', '[SuMo]', '[Playtest]']) {
        for (const object of objects) {
            if (object.name.includes(version)) return object;
        }
    }
};

const player = createAudioPlayer();
let timeoutID;

const playAudioFromUrl = async (interaction, url) => {
    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (interaction.member && interaction.member.voice.channel) {
        clearTimeout(timeoutID);
        timeoutID = undefined;

        const channel = interaction.member.voice.channel;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
        }
        catch (error) {
            console.warn(error);
            await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
            return;
        }

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('The connection has entered the Ready state - ready to play audio!');
        });

        timeoutID = setTimeout(() => {
            connection.destroy();
        }, 600e3);

        const resource = createAudioResource(url);
        player.play(resource);
        connection.subscribe(player);
    }
};

module.exports = {
    executeSimpleDefineCommand: executeSimpleDefineCommand,
    executeSimpleRandomCommand: executeSimpleRandomCommand,
    executeCommandInteraction: executeCommandInteraction,
    getSuggestion: getSuggestion,
    addLongField: addLongField,
    addMegaButtons: addMegaButtons,
    getLastPlaytestVersion: getLastPlaytestVersion,
    playAudioFromUrl: playAudioFromUrl,
};
