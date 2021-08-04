const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commands_utils');

const getAbility = async (name) => {
    return await models.ability.findOne({
        where: { name: { [Op.like]: name } },
        include: [
            { model: models.action, as: 'action' },
            { model: models.frequency, as: 'frequency' },
            { model: models.keyword, as: 'keyword' },
        ],
    });
};

const getAbilityEmbed = (ability) => {
    const embed = new MessageEmbed()
        .setTitle(ability.name)
        .setFooter('Ability')
        .setColor('RANDOM');

    const fields = [];

    if (ability.frequency) { fields.push({ name: 'Frequency', value: ability.frequency.value, inline: true }); }
    if (ability.action) {
        let actionName = `${ability.action.name} Action`;
        if (ability.keyword) {
            actionName += `, ${ability.keyword.name}`;
        }
        fields.push({ name: actionName, value: '\u200b', inline: true });
    }
    if (ability.trigger) { fields.push({ name: 'Trigger', value: ability.trigger, inline: true }); }
    if (ability.target) { fields.push({ name: 'Target', value: ability.target, inline: true }); }

    addLongField(fields, 'Effect', ability.effect);

    embed.setFields(fields);
    return embed;
};

module.exports = {
    name: 'ability',
    description: 'Defines an Ability',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Ability',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getAbility, getAbilityEmbed);
    },
};