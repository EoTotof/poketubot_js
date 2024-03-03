const { EmbedBuilder, ButtonBuilder } = require('discord.js');

const { getPokemons } = require('./pokedex.js').otherExports;
const { addMegaButtons, executeCommandInteraction, getSuggestion } = require('../commandsUtils');
const { toTitleCase } = require('../../utils');
const models = require('../../models');
const { ApplicationCommandOptionType } = require('discord.js');


const getPictureEmbed = (pokemon, megaForm = undefined) => {
    let description = pokemon.name;
    if (pokemon.form) {
        description += ` - ${pokemon.form} form`;
    }
    if (megaForm) {
        description += ` - ${toTitleCase(megaForm, '_')}`;
    }

    const form = [pokemon.form_number, megaForm]
        .filter((x) => x)
        .join('_');

    return new EmbedBuilder()
        .setDescription(description)
        .setImage(
            process.env.PIC_URL
                .replace('<pokemon>', `${pokemon.number.toString().padStart(3, '0')}`)
                .replace('<form>', form ? `-${form}` : ''),
        )
        .setColor('Random');
};

const getInteractionButtons = (pokemons, timestamp) => {
    const buttons = pokemons.map((pokemon, index) => {
        return new ButtonBuilder()
            .setCustomId(`${timestamp}-picture-${pokemons[0].number}-${index}`)
            .setLabel(pokemon.form || 'Normal')
            .setStyle('Primary');
    });

    addMegaButtons(buttons, timestamp, pokemons, 'picture');
    return buttons;
};

const getInteractionFilter = (pokemons, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-picture-${pokemons[0].number}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (pokemons) => {
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
        await i.update({
            embeds: [getPictureEmbed(pokemons[form] || pokemons[0], megaForm)],
            components: [],
        });
    };
};

module.exports = {
    name: 'picture',
    description: 'Displays the picture of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: ApplicationCommandOptionType.String,
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        const timestamp = Date.now();
        const pokemons = await getPokemons(interaction.options.getString('name_or_number'));
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
                embeds: [new EmbedBuilder().setDescription(nothingFoundMessage)],
                ephemeral: true,
            });
        }
        else if (pokemons.length == 1 && !pokemons[0].mega_form) {
            await interaction.reply({
                embeds: [getPictureEmbed(pokemons[0])],
            });
        }
        else {
            await executeCommandInteraction(
                false,
                pokemons,
                timestamp,
                interaction,
                getInteractionButtons,
                `${pokemons[0].name} form?`,
                getInteractionFilter(pokemons, timestamp, interaction),
                getInteractionOnCollect(pokemons),
            );
        }
    },
};
