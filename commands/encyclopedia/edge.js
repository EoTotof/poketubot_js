const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commands_utils');

const getEdge = async (name) => {
    return await models.edge.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getEdgeEmbed = (edge) => {
    const embed = new MessageEmbed()
        .setTitle(edge.name)
        .setFooter('Edge')
        .setColor('RANDOM');

    const fields = [];
    if (edge.prerequisites) { fields.push({ name: 'Prerequisites', value: `${edge.prerequisites}` }); }

    addLongField(fields, 'Effect', edge.effect);

    return embed.setFields(fields);
};


module.exports = {
    name: 'edge',
    description: 'Defines a Edge',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Edge',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getEdge, getEdgeEmbed);
    },
};