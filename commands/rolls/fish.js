const { EmbedBuilder } = require('discord.js');
const { rollDice } = require('../../utils');

const getFishEmbed = () => {
    const roll = rollDice(1, 20)[0];

    let resultFieldValue;
    if (roll > 14) {
        resultFieldValue = 'Oh! It\'s a bite!\n'
            + 'Make an Athletics check of difficulty 8, or Rank + 1 using Colgate\'s system.\n'
            + 'In case of failure, roll 1d20: the Pokémon flees with your Bait on 10 or less.';
    }
    else {
        resultFieldValue = 'Not even a nibble!\n'
            + 'After 3 failed attempts, the Bait is consumed.';
    }

    const embed = new EmbedBuilder()
        .setTitle('Fishing roll')
        .setColor('Random');

    const fields = [
        { name: 'Roll', value: `${roll}` },
        { name: 'Result', value: resultFieldValue },
    ];

    return embed.addFields(fields);
};

module.exports = {
    name: 'fish',
    description: 'Roll to fish',
    async execute(interaction) {
        await interaction.reply({
            embeds: [getFishEmbed()],
        });
    },
};
