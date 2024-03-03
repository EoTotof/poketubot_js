const { EmbedBuilder } = require('discord.js');
const { getPokemons } = require('../encyclopedia/pokedex').otherExports;
const { rollDice } = require('../../utils');
const { ApplicationCommandOptionType } = require('discord.js');

const getGenderEmbed = (pokemon) => {
    const embed = new EmbedBuilder()
        .setTitle(`Gender roll for ${pokemon.name}`)
        .setColor('Random');

    if (pokemon.male_ratio === null) {
        embed.setDescription(`${pokemon.name} has no gender.`);
    }
    else {
        const roll = rollDice(1, 8)[0];
        const gender = roll * 12.5 <= pokemon.male_ratio ? 'Male' : 'Female';

        const fields = [
            { name: 'Male ratio', value: `${pokemon.male_ratio} %`, inline: true },
            { name: 'Result', value: `**${gender}**`, inline: true },
        ];
        embed.setFields(fields);
    }
    return embed;
};

module.exports = {
    name: 'gender',
    description: 'Rolls for the gender of a given Pokémon',
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
            embeds: [getGenderEmbed(pokemons[0])],
        });
    },
};
