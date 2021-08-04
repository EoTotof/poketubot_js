const { MessageEmbed } = require('discord.js');
const { rollDice } = require('../../utils');

const getAppealEmbed = (diceNumber, isCenterOfAttention) => {
    const embed = new MessageEmbed()
        .setTitle(`Appeal roll ${isCenterOfAttention ? 'as the Center of Attention' : ''} - ${diceNumber}d6`)
        .setColor('RANDOM');

    const rolls = rollDice(diceNumber, 6);
    const rollToAppeal = isCenterOfAttention ? ((x) => Math.floor(x / 2) - (x < 3)) : ((x) => 1 - (x === 1) + (x === 6));
    const appeal = rolls
        .map(rollToAppeal)
        .reduce((x, y) => x + y);

    return embed.addFields(
        { name: 'Roll', value: rolls.join(', '), inline: true },
        { name: 'Total Appeal', value: `${appeal}` },
    );
};

module.exports = {
    name: 'appeal',
    description: 'Appeal roll during a Pokémon contest',
    options: [
        {
            name: 'dice_number',
            type: 'INTEGER',
            description: 'Number of dice that are rolled.',
            required: true,
        },
        {
            name: 'center_of_attention',
            type: 'BOOLEAN',
            description: 'The Pokémon is the Center of Attention',
            required: false,
        },
    ],
    async execute(interaction) {
        const diceNumber = interaction.options.getInteger('dice_number');

        if (diceNumber > 50) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('No more than 50 dice!')],
            });
        }
        else if (diceNumber === 0) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('One die minimum!')],
            });
        }
        else {
            await interaction.reply({
                embeds: [getAppealEmbed(diceNumber, interaction.options.getBoolean('center_of_attention'))],
            });
        }
    },
};