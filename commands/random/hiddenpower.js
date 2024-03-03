const { EmbedBuilder } = require('discord.js');
const { Sequelize } = require('sequelize');
const models = require('../../models');
const { executeSimpleRandomCommand } = require('../commandsUtils');

const getRandomType = async () => {
    return await models.type.findOne({
        order: Sequelize.fn('Random'),
        limit: 1,
    });
};

const getHiddenpowerEmbed = (type) => {
    return new EmbedBuilder()
        .setTitle(`${type.name} Type`)
        .setColor('Random');
};


module.exports = {
    name: 'hiddenpower',
    description: 'Returns a random Type',
    async execute(interaction) {
        await executeSimpleRandomCommand(interaction, getRandomType, getHiddenpowerEmbed);
    },
};
