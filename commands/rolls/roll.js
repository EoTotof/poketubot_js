const { MessageEmbed } = require('discord.js');
const { rollDice } = require('../../utils');

const getRollEmbed = (diceString) => {
    const rollOne = (simpleDiceString) => {
        // Parse and evaluate a simple dice string `+-XdY`
        const [number, die] = simpleDiceString.split('D').map((x) => parseInt(x));

        const rolls = rollDice(Math.abs(number), die);
        const rollsSum = rolls.reduce((x, y) => x + y, 0);

        return {
            rollsSum: number < 0 ? -rollsSum : rollsSum,
            resultString: `${number}d${die} : ${rolls.join(', ')}`,
        };
    };

    const diceRegex = /[+-]?\d+D\d+|[+-]?\d+/g;

    const dice = [];
    const modifiers = [];

    // Separate dice `+-XdY` from modifiers `+-Z`
    let match;
    while ((match = diceRegex.exec(diceString.toUpperCase()))) {
        const diceStringItem = match[0];
        if (diceStringItem.includes('D')) {
            dice.push(diceStringItem);
        }
        else {
            modifiers.push(diceStringItem);
        }
    }

    // Check if no more than 1000 dice
    const diceNumber = dice
        .map((x) => Math.abs(parseInt(x.split('D')[0])))
        .reduce((x, y) => x + y, 0);

    if (diceNumber > 1000) {
        return new MessageEmbed()
            .setDescription('No more than 1000 dice!');
    }
    else {
        const diceRolls = dice.map(rollOne);

        let rollsTotal = modifiers
            .map((x) => parseInt(x))
            .reduce((x, y) => x + y, 0);
        const resultStrings = [];

        diceRolls.forEach(({ rollsSum, resultString }) => {
            rollsTotal += rollsSum;
            resultStrings.push(resultString);
        });

        // Detailed report if no more than 50 dice and no more than 5 different dice
        // If no dice (only modifiers) we use the short report
        let response;
        if (diceNumber > 50 || dice.length > 5 || dice.length == 0) {
            response = `**${diceString} :** ${rollsTotal}`;
        }
        else if (resultStrings.length > 1) {
            response = `**${diceString} :**\n${resultStrings.join('\n')}\n**Total : **${rollsTotal}`;
        }
        else if (diceNumber > 1 || modifiers.length > 0) {
            response = `**${diceString} :** ${resultStrings[0].split(': ')[1]} **Total : **${rollsTotal}`;
        }
        else {
            response = `**${diceString} :** ${rollsTotal}`;
        }

        const embed = new MessageEmbed()
            .setDescription(response)
            .setColor('RANDOM');
        return embed;
    }
};

module.exports = {
    name: 'roll',
    description: 'Simple dice roll. 1000 dice max',
    options: [
        {
            name: 'dice_string',
            type: 'STRING',
            description: 'The dice to roll',
            required: true,
        }, {
            name: 'user',
            type: 'USER',
            description: 'The User who will receive the result of your roll (if not given, the roll is sent to the channel)',
            required: false,
        },
    ],
    async execute(interaction) {
        let diceString = interaction.options.getString('dice_string');
        if (!diceString.match(/^(?:(?:\s*[+-]\s*)?\d+(?:\s*[dD]\s*\d+)?)+$/g)) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Not a valid expression')],
            });
        }
        else {
            diceString = diceString.replace(/\s/, '');
            const embeds = [getRollEmbed(diceString)];

            if (interaction.options.getUser('user')) {
                const location = interaction.guild ? `in "${interaction.guild}", on ${interaction.channel}` : 'in a private channel';
                await interaction.options.getUser('user').send({
                    content: `${interaction.user} rolled for you ${location}`,
                    embeds: embeds,
                });
                await interaction.reply({
                    content: `${interaction.options.getUser('user')} received the result of your roll ${location}`,
                    embeds: embeds,
                    ephemeral: true,
                });
            }
            else {
                await interaction.reply({
                    embeds: embeds,
                });
            }
        }
    },
    otherExports: {
        getRollEmbed: getRollEmbed,
    },
};
