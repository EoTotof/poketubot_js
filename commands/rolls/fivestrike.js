const { MessageEmbed } = require('discord.js');

const getFivestrikeEmbed = (prerolled = undefined) => {
    const roll = prerolled ? prerolled : Math.floor(Math.random() * 8) + 1;

    return new MessageEmbed()
        .setTitle('Fivestrike')
        .setColor('RANDOM')
        .setFields([
            {
                name: prerolled ? 'Prerolled value' : 'Roll',
                value: `${roll}`,
                inline: true,
            },
            {
                name: 'Result',
                value: `**${Math.floor(roll / 2) + (roll != 6)} hit${roll > 1 ? 's' : ''}**`,
                inline: true,
            },
        ]);
};

module.exports = {
    name: 'fivestrike',
    description: 'Rolls the number of hits of a five-strike move',
    options: [{
        name: 'prerolled',
        type: 'INTEGER',
        description: 'Result of the die (it will not be rolled). Between 1 and 8.',
        required: false,
    }],
    async execute(interaction) {
        const prerolled = interaction.options.getInteger('prerolled');
        if (!prerolled || (prerolled >= 1 && prerolled <= 8)) {
            await interaction.reply({
                embeds: [getFivestrikeEmbed(prerolled)],
            });
        }
        else {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('The die value must be between 1 and 8.')],
            });
        }

    },
};