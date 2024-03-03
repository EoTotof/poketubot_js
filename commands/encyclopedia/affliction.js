const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');
const { EmbedBuilder } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

const getAffliction = async (name) => {
    return await models.affliction.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getAfflictionEmbed = (affliction) => {
    return new EmbedBuilder()
        .setTitle(affliction.display_name)
        .setDescription(affliction.description)
        .setFooter({ text:`${affliction.persistence} Affliction` })
        .setColor('Random');
};

module.exports = {
    name: 'affliction',
    description: 'Defines an Affliction',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Affliction',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getAffliction, getAfflictionEmbed, models.affliction);
    },
    otherExports: {
        getAffliction: getAffliction,
    },
};
