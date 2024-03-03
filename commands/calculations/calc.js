const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Parser } = require('expr-eval');

const getCalcEmbed = (expression, result) => {
    return new EmbedBuilder()
        .setDescription(`${expression} = ${result}`)
        .setColor('Random');
};

module.exports = {
    name: 'calc',
    description: 'Evaluates a mathematical expression (using "JavaScript Expression Evaluator")',
    options: [{
        name: 'expression',
        type: ApplicationCommandOptionType.String,
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
                embeds: [new EmbedBuilder().setDescription('Not a valid expression')],
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
