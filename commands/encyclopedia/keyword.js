const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');

const getKeyword = async (name) => {
    return await models.keyword.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getKeywordEmbed = (keyword) => {
    return new MessageEmbed()
        .setTitle(keyword.name)
        .setDescription(keyword.description)
        .setFooter('Keyword')
        .setColor('RANDOM');
};


module.exports = {
    name: 'keyword',
    description: 'Defines a Move Keyword',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Keyword',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getKeyword, getKeywordEmbed, models.keyword);
    },
    otherExports: {
        getKeyword: getKeyword,
    },
};
