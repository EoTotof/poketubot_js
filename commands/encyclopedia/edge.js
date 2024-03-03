const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commandsUtils');
const { ApplicationCommandOptionType } = require('discord.js');

const getEdge = async (name) => {
    return await models.edge.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getEdgeEmbed = (edge) => {
    const embed = new EmbedBuilder()
        .setTitle(edge.name)
        .setFooter({ text:'Edge' })
        .setColor('Random');

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
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Edge',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getEdge, getEdgeEmbed, models.edge);
    },
    otherExports: {
        getEdge: getEdge,
    },
};
