const { ApplicationCommandOptionType } = require('discord.js');
const pokedex = require('./pokedex');

// Alias for `pokedex` command
module.exports = {
    name: 'dex',
    description: 'Displays the Pokédex entry of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: ApplicationCommandOptionType.String,
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    execute: pokedex.execute,
};
