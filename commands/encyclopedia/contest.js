const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');

const getContestEffect = async (name) => {
    return await models.contesteffect.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getContestEmbed = (contestEffect) => {
    return new MessageEmbed()
        .setTitle(contestEffect.name)
        .setFields([
            { name: 'Dice', value: contestEffect.dice_roll, inline: true },
            { name: 'Effect', value: contestEffect.effect, inline: true },
        ])
        .setFooter('Contest Effect')
        .setColor('RANDOM');
};


module.exports = {
    name: 'contest',
    description: 'Defines a Contest Effect',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Contest Effect',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getContestEffect, getContestEmbed, models.contesteffect);
    },
    otherExports: {
        getContestEffect: getContestEffect,
    },
};
