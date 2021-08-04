const { MessageEmbed } = require('discord.js');
const models = require('../../models');
const { normalizeString } = require('../../utils');
const { executeSimpleDefineCommand } = require('../commands_utils');

const getMove = async (name) => {
    const moves = await models.move.findAll({ include: [
        { model: models.type, as: 'type' },
        { model: models.category, as: 'category' },
        { model: models.damagebase, as: 'db' },
        { model: models.frequency, as: 'frequency' },
        { model: models.contesttype, as: 'contest_type' },
        { model: models.contesteffect, as: 'contest_effect' },
    ] });
    return moves.filter((move) => {
        return move.search_string.includes(`#${normalizeString(name)}#`);
    })[0];
};

const getMoveEmbed = (move) => {
    const embed = new MessageEmbed()
        .setTitle(move.name)
        .setDescription(`*${move.french_name}*`)
        .setFooter('Move')
        .setColor('RANDOM');

    const fields = [
        { name: 'Type', value: move.type.name, inline: true },
        { name: 'Class', value: move.category.name, inline: true },
    ];
    if (move.db) { fields.push({ name: `DB ${move.db.value}`, value: move.db.dice_roll, inline: true }); }
    if (move.frequency) { fields.push({ name: 'Frequency', value: move.frequency.value, inline: true }); }
    if (move.accuracy) { fields.push({ name: 'AC', value: `${move.accuracy}`, inline: true }); }
    if (move.range) { fields.push({ name: 'Range', value: move.range, inline: true }); }
    if (move.contest_type) { fields.push({ name: 'Contest Stats', value: `${move.contest_type.name} - ${move.contest_effect.name}` }); }
    if (move.effect && move.effect != '--') { fields.push({ name: 'Effect', value: move.effect }); }

    return embed.setFields(fields);
};

module.exports = {
    name: 'move',
    description: 'Defines a Move',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Move (English or French)',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getMove, getMoveEmbed);
    },
};