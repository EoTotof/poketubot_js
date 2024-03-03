const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const getCapability = async (name) => {
    return await models.capability.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getCapabilityEmbed = (capability) => {
    return new EmbedBuilder()
        .setTitle(capability.name)
        .setDescription(capability.description)
        .setFooter({ text:('Capability') })
        .setColor('Random');
};

module.exports = {
    name: 'capability',
    description: 'Defines a Capability',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Capability',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getCapability, getCapabilityEmbed, models.capability);
    },
    otherExports: {
        getCapability: getCapability,
    },
};
