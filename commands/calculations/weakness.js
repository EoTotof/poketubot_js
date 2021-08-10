const { MessageEmbed } = require('discord.js');

const getWeaknessEmbed = (damage, weaknessLevel) => {
    weaknessLevel = weaknessLevel || 1;
    const weaknessMultiplier = (1.5 + 0.5 * Math.floor((weaknessLevel - 1) * 1.5));

    return new MessageEmbed()
        .setTitle('Weakness')
        .setDescription(
            `${damage} damage after weakness is applied (x ${weaknessMultiplier}): `
              + `**${Math.floor(damage * weaknessMultiplier)}**`,
        )
        .setColor('RANDOM');
};

module.exports = {
    name: 'weakness',
    description: 'Applies weakness to a damage value',
    options: [
        {
            name: 'damage',
            type: 'INTEGER',
            description: 'Damage before application of weakness',
            required: true,
        },
        {
            name: 'weakness_level',
            type: 'INTEGER',
            description: 'Level of weakness. 1 by default (simple weakness), 3 maximum.',
            required: false,
        },
    ],
    async execute(interaction) {
        const weaknessLevel = interaction.options.getInteger('weakness_level');
        if (weaknessLevel && (weaknessLevel < 1 || weaknessLevel > 3)) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Weakness level must be between 1 and 3.')],
            });
        }
        else {
            await interaction.reply({
                embeds: [getWeaknessEmbed(
                    interaction.options.getInteger('damage'),
                    weaknessLevel,
                )],
            });
        }
    },
};
