const { MessageEmbed } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand } = require('../commandsUtils');

const getAffliction = async (name) => {
    return await models.affliction.findOne({
        where: { name: { [Op.like]: name } },
    });
};

const getAfflictionEmbed = (affliction) => {
    return new MessageEmbed()
        .setTitle(affliction.display_name)
        .setDescription(affliction.description)
        .setFooter(`${affliction.persistence} Affliction`)
        .setColor('RANDOM');
};

module.exports = {
    name: 'affliction',
    description: 'Defines an Affliction',
    options: [{
        name: 'name',
        type: 'STRING',
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
