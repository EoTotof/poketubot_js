const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commandsUtils');

const getCombatManeuver = async (name) => {
    return await models.combatmaneuver.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getManeuverEmbed = (combatManeuver) => {
    const embed = new MessageEmbed()
        .setTitle(combatManeuver.name)
        .setFooter('Combat Maneuver')
        .setColor('RANDOM');

    const fields = [];
    if (combatManeuver.accuracy) { fields.push({ name: 'AC', value: `${combatManeuver.accuracy}`, inline: true }); }
    if (combatManeuver.range) { fields.push({ name: 'Range', value: combatManeuver.range, inline: true }); }

    addLongField(fields, 'Effect', combatManeuver.effect);

    return embed.setFields(fields);
};


module.exports = {
    name: 'maneuver',
    description: 'Defines a Combat Maneuver',
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of the Combat Maneuver',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getCombatManeuver, getManeuverEmbed, models.combatmaneuver);
    },
    otherExports: {
        getCombatManeuver: getCombatManeuver,
    },
};
