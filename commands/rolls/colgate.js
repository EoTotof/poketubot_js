const { MessageEmbed } = require('discord.js');
const { rollDice } = require('../../utils');

const getColgateEmbed = (expression) => {
    const expressionRegex = /[+-]?\d+/g;
    let match;
    let rank = 0;
    while ((match = expressionRegex.exec(expression))) {
        rank += parseInt(match[0]);
    }

    const rolls = rollDice(2, 6);

    return new MessageEmbed()
        .setColor('RANDOM')
        .addFields(
            {
                name: 'Skill Rank',
                value: rank < 1 ? '0 or below' : (rank > 5 ? '6 or above' : `${rank}`),
                inline: true,
            },
            {
                name: 'Result',
                value: (rank < 1 || rank > 5) ? `**${rolls.join(', ')}**` : `**${rolls[0]}**`,
                inline: true,
            },
        );
};

module.exports = {
    name: 'colgate',
    description: 'Skill check using Colgate\'s system',
    options: [{
        name: 'expression',
        type: 'STRING',
        description: 'Your Skill rank modified with the Difficulty of the check. Supports addition and substraction',
        required: true,
    }],
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        if (!expression.match(/^((?:[+-]?\d+)+)$/g)) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Not a valid expression')],
            });
        }
        else {
            await interaction.reply({
                embeds: [getColgateEmbed(expression)],
            });
        }
    },
};