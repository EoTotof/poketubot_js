const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commands_utils');

const getWeatherCondition = async (name) => {
    return await models.weathercondition.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getWeatherEmbed = (weatherCondition) => {
    return new MessageEmbed()
        .setTitle(weatherCondition.display_name)
        .setDescription(weatherCondition.description)
        .setFooter('Weather Condition')
        .setColor('RANDOM');
};

module.exports = {
    name: 'weather',
    description: 'Defines a Weather Condition',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Weather Condition',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getWeatherCondition, getWeatherEmbed);
    },
};