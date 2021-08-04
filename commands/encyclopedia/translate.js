const { MessageEmbed } = require('discord.js');
const { otherExports } = require('./pokedex.js');

const getTranslateEmbed = (pokemon) => {
    return new MessageEmbed()
        .setTitle(`${pokemon.name}`)
        .setFields([
            { name: 'French', value: pokemon.french_name, inline: true },
            { name: 'German', value: pokemon.german_name, inline: true },
            { name: 'Japanese', value: pokemon.japanese_name, inline: true },
        ])
        .setFooter(`Pokémon #${pokemon.number}`)
        .setColor('RANDOM');
};

module.exports = {
    name: 'translate',
    description: 'Displays the name of a Pokémon in English, French, German and Japanese',
    options: [{
        name: 'name_or_number',
        type: 'STRING',
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        const pokemons = await otherExports.getPokemons(interaction.options.getString('name_or_number'));

        if (pokemons.length === 0) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(`Nothing found for "${interaction.options.getString('name_or_number')}"`)],
            });
        }

        await interaction.reply({
            embeds: [getTranslateEmbed(pokemons[0])],
        });
    },
};