const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');
const { ApplicationCommandOptionType } = require('discord.js');

const getWeatherCondition = async (name) => {
    return await models.weathercondition.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getWeatherEmbed = (weatherCondition) => {
    return new EmbedBuilder()
        .setTitle(weatherCondition.display_name)
        .setDescription(weatherCondition.description)
        .setFooter({ text:'Weather Condition' })
        .setColor('Random');
};

module.exports = {
    name: 'weather',
    description: 'Defines a Weather Condition',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Weather Condition',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getWeatherCondition, getWeatherEmbed, models.weathercondition);
    },
    otherExports: {
        getWeatherCondition: getWeatherCondition,
    },
};
