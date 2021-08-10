const { MessageEmbed, MessageButton } = require('discord.js');

const models = require('../../models');
const { normalizeString } = require('../../utils');
const { executeCommandInteraction, getSuggestion } = require('../commandsUtils');

const getPokemons = async (nameOrNumber) => {
    let pokemons;
    if (!isNaN(parseInt(nameOrNumber))) {
        pokemons = await models.pokemon.findAll({
            where: { number:  parseInt(nameOrNumber) },
        });
    }
    else {
        pokemons = await models.pokemon.findAll();
        pokemons = pokemons.filter((pokemon_) => {
            return pokemon_.search_string.includes(`#${normalizeString(nameOrNumber)}#`);
        });
    }

    return pokemons;
};

const getPokedexEmbed = (pokemon, form = undefined) => {
    return new MessageEmbed()
        .setDescription(`${pokemon.name}${form ? ' - ' + pokemon.form + ' form' : '' }`)
        .setImage(
            process.env.DEX_URL
                .replace('<pokemon>', `${pokemon.number}`)
                .replace('<form>', form > 0 ? `-${form}` : ''),
        )
        .setColor('RANDOM');
};

const getInteractionButtons = (pokemons, timestamp) => {
    return pokemons.map((pokemon, index) => {
        return new MessageButton()
            .setCustomId(`${timestamp}-pokedex-${pokemons[0].number}-${index}`)
            .setLabel(pokemon.form)
            .setStyle('PRIMARY');
    });
};

const getInteractionFilter = (pokemons, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-pokedex-${pokemons[0].number}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (pokemons) => {
    return async (i) => {
        const form = i.customId.split('-')[3];
        await i.update({
            embeds: [getPokedexEmbed(pokemons[form], form)],
            components: [],
        });
    };
};

module.exports = {
    name: 'pokedex',
    description: 'Displays the Pokédex entry of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: 'STRING',
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
                embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
            });
        }
        else if (pokemons.length == 1) {
            await interaction.reply({
                embeds: [getPokedexEmbed(pokemons[0])],
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
    otherExports: {
        getPokemons: getPokemons,
    },
};
