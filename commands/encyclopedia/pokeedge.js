const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commandsUtils');

const getPokeEdge = async (name) => {
    return await models.pokeedge.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getPokeedgeEmbed = (pokeEdge) => {
    const embed = new MessageEmbed()
        .setTitle(pokeEdge.name)
        .setDescription(`${pokeEdge.tp_cost} TP`)
        .setFooter('Pokémon Edge')
        .setColor('RANDOM');

    const fields = [
        { name: 'Prerequisites', value: `${pokeEdge.prerequisites}` },
    ];

    addLongField(fields, 'Effect', pokeEdge.effect);

    return embed.setFields(fields);
};


module.exports = {
    name: 'pokeedge',
    description: 'Defines a Pokémon Edge',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Pokémon Edge',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getPokeEdge, getPokeedgeEmbed, models.pokeedge);
    },
    otherExports: {
        getPokeEdge: getPokeEdge,
    },
};
