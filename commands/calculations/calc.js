const { MessageEmbed } = require('discord.js');
const { Parser } = require('expr-eval');

const getCalcEmbed = (expression, result) => {
    return new MessageEmbed()
        .setDescription(`${expression} = ${result}`)
        .setColor('RANDOM');
};

module.exports = {
    name: 'calc',
    description: 'Evaluates a mathematical expression (using "JavaScript Expression Evaluator")',
    options: [{
        name: 'expression',
        type: 'STRING',
        description: 'Expression to be evaluated',
        required: true,
    }],
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        let result = null;
        try {
            result = Parser.evaluate(expression);
        }
        catch (error) {
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription('Not a valid expression')],
            });
            return;
        }
        await interaction.reply({
            embeds: [getCalcEmbed(expression, result)],
        });
    },
    otherExports: {
        getCalcEmbed: getCalcEmbed,
    },
};
