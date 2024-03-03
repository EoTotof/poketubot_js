const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { ApplicationCommandOptionType } = require('discord.js');

const getDamageBase = async (value) => {
    return await models.damagebase.findOne({
        where: { value: { [Op.like]: value } },
    });
};

const getDBEmbed = (damageBase, isCriticalHit) => {
    return new EmbedBuilder()
        .setTitle(`${isCriticalHit ? 'Critical Hit! ' : ''}DB ${damageBase.value}`)
        .setDescription(isCriticalHit ? damageBase.critical_roll : damageBase.dice_roll)
        .setColor('Random');
};


module.exports = {
    name: 'db',
    description: 'Returns the Dice Roll of a Damage Base (DB) value',
    options: [
        {
            name: 'value',
            type: ApplicationCommandOptionType.Integer,
            description: 'Value of the Damage Base (DB), from 1 to 28',
            required: true,
        },
        {
            name: 'critical_hit',
            type: ApplicationCommandOptionType.Boolean,
            description: 'The hit is a Critical Hit!',
            required: false,
        },
    ],
    async execute(interaction) {
        const object = await getDamageBase(interaction.options.getInteger('value'));
        if (!object) {
            await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`Nothing found for "${interaction.options.getInteger('value')}"`)],
            });
        }
        else {
            await interaction.reply({
                embeds: [getDBEmbed(object, interaction.options.getBoolean('critical_hit'))],
            });
        }
    },
};
