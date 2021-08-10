const { MessageEmbed } = require('discord.js');

const getResistanceEmbed = (damage, resistanceLevel) => {
    resistanceLevel = resistanceLevel || 1;
    const resistanceDivisor = 2 ** resistanceLevel;

    return new MessageEmbed()
        .setTitle('Resistance')
        .setDescription(
            `${damage} damage after resistance is applied (÷ ${resistanceDivisor}): `
              + `**${Math.ceil(damage / resistanceDivisor)}**`,
        )
        .setColor('RANDOM');
};

module.exports = {
    name: 'resistance',
    description: 'Applies resistance to a damage value.',
    options: [
        {
            name: 'damage',
            type: 'INTEGER',
            description: 'Damage before application of resistance',
            required: true,
        },
        {
            name: 'resistance_level',
            type: 'INTEGER',
            description: 'Level of resistance. 1 by default (simple resistance), 3 maximum.',
            required: false,
        },
    ],
    async execute(interaction) {
        const resistanceLevel = interaction.options.getInteger('resistance_level');
        if (resistanceLevel && (resistanceLevel < 1 || resistanceLevel > 3)) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Resistance level must be between 1 and 3.')],
            });
        }
        else {
            await interaction.reply({
                embeds: [getResistanceEmbed(
                    interaction.options.getInteger('damage'),
                    resistanceLevel,
                )],
            });
        }
    },
};
