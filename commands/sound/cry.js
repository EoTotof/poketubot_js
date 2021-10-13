const { MessageEmbed, MessageButton } = require('discord.js');
const { Op } = require('sequelize');

const models = require('../../models');
const { toTitleCase, normalizeString } = require('../../utils');
const { addMegaButtons, executeCommandInteraction, playAudioFromUrl, getSuggestion } = require('../commandsUtils');

const getPokemonsWithCries = async (nameOrNumber) => {
    let pokemons;
    if (!isNaN(parseInt(nameOrNumber))) {
        pokemons = await models.pokemon.findAll({
            where: {
                number:  parseInt(nameOrNumber),
                [Op.or] : [
                    { form_number: null },
                    { has_form_cry: 1 },
                ],
            },
        });
    }
    else {
        pokemons = await models.pokemon.findAll({
            where: { [Op.or] : [
                { form_number: null },
                { has_form_cry: 1 },
            ] },
        });
        pokemons = pokemons.filter((pokemon_) => {
            return pokemon_.search_string.includes(`#${normalizeString(nameOrNumber)}#`);
        });
    }

    return pokemons;
};

const getCryEmbed = (pokemon, megaForm = undefined) => {
    let description = pokemon.name;
    if (pokemon.form) {
        description += ` - ${pokemon.form} form`;
    }
    if (megaForm) {
        description += ` - ${toTitleCase(megaForm, '_')}`;
    }

    return new MessageEmbed()
        .setDescription(`Playing Cry of ${description}`)
        .setColor('RANDOM');
};

const getInteractionButtons = (pokemons, timestamp) => {
    const buttons = pokemons.map((pokemon, index) => {
        return new MessageButton()
            .setCustomId(`${timestamp}-cry-${pokemons[0].number}-${index}`)
            .setLabel(pokemon.form || 'Normal')
            .setStyle('PRIMARY');
    });

    addMegaButtons(buttons, timestamp, pokemons, 'cry');
    return buttons;
};

const getInteractionFilter = (pokemons, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-cry-${pokemons[0].number}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (interaction, pokemons) => {
    return async (i) => {
        const formID = i.customId.split('-')[3];
        let form;
        let megaForm;
        if (formID.includes('+')) {
            [form, megaForm] = i.customId.split('-')[3].split('+');
        }
        else if (!isNaN(parseInt(formID))) {
            form = formID;
        }
        else {
            megaForm = formID;
        }

        const pokemon = pokemons[form] || pokemons[0];
        playCry(i, pokemon, megaForm);

        await i.update({
            embeds: [getCryEmbed(pokemon, megaForm)],
            components: [],
        });
    };
};

const playCry = (interaction, pokemon, megaForm) => {
    const form = [pokemon.form_number, megaForm]
        .filter((x) => x)
        .join('_');

    playAudioFromUrl(
        interaction,
        process.env.CRY_URL
            .replace('<pokemon>', `${pokemon.number}`)
            .replace('<form>', form ? `-${form}` : ''))
    ;
};

module.exports = {
    name: 'cry',
    description: 'Plays the Cry of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: 'STRING',
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        const channel = interaction.member?.voice.channel;
        if (!channel) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Please join a voice channel to use this command.')],
                ephemeral: true,
            });
            return;
        }
        const timestamp = Date.now();
        const pokemons = await getPokemonsWithCries(interaction.options.getString('name_or_number'));
        if (pokemons.length == 0) {
            const suggestion = await getSuggestion({
                searchValue: interaction.options.getString('name_or_number'),
                model: models.pokemon,
                fields: ['name', 'french_name'],
                storeFields: ['name', 'french_name'],
                displayFunction: ((result) => `${result.name} (${result.french_name})`),
            });
            let nothingFoundMessage = `Nothing found for "${interaction.options.getString('name_or_number')}"`;
            nothingFoundMessage += suggestion.length === 0 ? '' : `\nDid you mean ${suggestion.join(', ')}?`;
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
                ephemeral: true,
            });
        }
        else if (pokemons.length == 1 && !pokemons[0].mega_form) {
            playCry(interaction, pokemons[0]);
            await interaction.reply({
                embeds: [getCryEmbed(pokemons[0])],
                ephemeral: true,
            });
        }
        else {
            await executeCommandInteraction(
                true,
                pokemons,
                timestamp,
                interaction,
                getInteractionButtons,
                `${pokemons[0].name} form?`,
                getInteractionFilter(pokemons, timestamp, interaction),
                getInteractionOnCollect(interaction, pokemons),
            );
        }

    },
};
