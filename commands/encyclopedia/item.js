const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commands_utils');

const getItem = async (name) => {
    return await models.item.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getItemEmbed = (item) => {
    const embed = new MessageEmbed()
        .setTitle(item.name)
        .setFooter('Item')
        .setColor('RANDOM');

    if (item.cost) { embed.setDescription(`${item.cost} ₽`);}

    const fields = [];
    if (item.modifier) {
        fields.push({
            name: 'Modifier',
            value: `${item.modifier >= 0 ? '+' : ''}${item.modifier}`,
            inline: true,
        });
    }
    if (item.additional_info) { fields.push({ name: 'Additional info', value: item.additional_info, inline: true }); }

    addLongField(fields, 'Description', item.description);

    embed.setFields(fields);
    return embed;

};

module.exports = {
    name: 'item',
    description: 'Defines an Item',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Item',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getItem, getItemEmbed);
    },
};