const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getPokemons } = require('./pokedex.js').otherExports;

const getTranslateEmbed = (pokemon) => {
    return new EmbedBuilder()
        .setTitle(`${pokemon.name}`)
        .setFields([
            { name: 'French', value: pokemon.french_name, inline: true },
            { name: 'German', value: pokemon.german_name, inline: true },
            { name: 'Japanese', value: pokemon.japanese_name, inline: true },
        ])
        .setFooter({ text:`Pokémon #${pokemon.number}` })
        .setColor('Random');
};

module.exports = {
    name: 'translate',
    description: 'Displays the name of a Pokémon in English, French, German and Japanese',
    options: [{
        name: 'name_or_number',
        type: ApplicationCommandOptionType.String,
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        const pokemons = await getPokemons(interaction.options.getString('name_or_number'));

        if (pokemons.length === 0) {
            await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`Nothing found for "${interaction.options.getString('name_or_number')}"`)],
            });
        }

        await interaction.reply({
            embeds: [getTranslateEmbed(pokemons[0])],
        });
    },
};
