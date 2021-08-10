const { Sequelize } = require('sequelize');
const models = require('../../models');
const executePokedex = require('../encyclopedia/pokedex').execute;
const executePicture = require('../encyclopedia/picture').execute;

const getRandomPokemon = async () => {
    return await models.pokemon.findOne({
        where: { form_number: null },
        order: Sequelize.fn('RANDOM'),
        limit: 1,
    });
};

module.exports = {
    name: 'random',
    description: 'Returns a random Pokémon',
    options: [ {
        name: 'command',
        type: 'STRING',
        description: 'Display Pokédex entry or picture. Pokédex entry by default.',
        required: false,
        choices: [
            { name: 'Pokédex entry', value: 'pokedex' },
            { name: 'Picture', value: 'picture' },
        ],
    } ],
    async execute(interaction) {
        const pokemon = await getRandomPokemon();
        interaction.options._hoistedOptions.push(
            { name: 'name_or_number', type: 'STRING', value: pokemon.name },
        );
        if (interaction.options.getString('command') === 'picture') {
            await executePicture(interaction);
        }
        else {
            await executePokedex(interaction);
        }
    },
};
