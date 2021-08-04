const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commands_utils');

const getCapability = async (name) => {
    return await models.capability.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getCapabilityEmbed = (capability) => {
    return new MessageEmbed()
        .setTitle(capability.name)
        .setDescription(capability.description)
        .setFooter('Capability')
        .setColor('RANDOM');
};

module.exports = {
    name: 'capability',
    description: 'Defines a Capability',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Capability',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getCapability, getCapabilityEmbed);
    },
};