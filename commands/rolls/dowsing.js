const { MessageEmbed } = require('discord.js');
const { rollDice } = require('../../utils');

const getDowsingEmbed = (diceNumber) => {
    const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet'];
    const bounty = Object.fromEntries(colors.map((x) => [x, 0]));

    let diceLeft = diceNumber;
    const totalRolls = [];

    // Exploding rolls to find shards
    while (diceLeft > 0) {
        const rolls = rollDice(diceLeft, 6);
        totalRolls.push(...rolls);
        diceLeft = rolls.filter((x) => x == 6).length;
    }
    const totalShards = totalRolls.filter((x) => x > 3).length;

    // Determine shard colors
    for (let i = 0; i < totalShards; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        bounty[color] += 1;
    }

    const embed = new MessageEmbed()
        .setTitle(`Dowsing roll - ${diceNumber}d6`)
        .setColor('RANDOM');

    const fields = [{ name: 'Roll', value: totalRolls.map((x) => x == 6 ? '**6**' : x).join(', ') }];

    if (totalShards > 0) {
        Object.entries(bounty).forEach(([color, number]) => {
            if (number > 0) { fields.push({ name: color, value: `${number}`, inline: true }); }
        });
    }
    else {
        fields.push({ name: '\u200b', value: 'No Shard found' });
    }

    return embed.addFields(fields);
};

module.exports = {
    name: 'dowsing',
    description: 'Roll to look for Shards using a Dowsing Rod',
    options: [{
        name: 'dice_number',
        type: 'INTEGER',
        description: 'Number of dice that are rolled.',
        required: true,
    }],
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
                embeds: [getDowsingEmbed(diceNumber)],
            });
        }
    },
};