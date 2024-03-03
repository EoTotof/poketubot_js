const { EmbedBuilder } = require('discord.js');
const { Sequelize, Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleRandomCommand, executeSimpleDefineCommand } = require('../commandsUtils');
const { ApplicationCommandOptionType } = require('discord.js');

const getNatureByName = async (name) => {
    return await models.nature.findOne({
        include: [
            { model: models.stat, as: 'increase' },
            { model: models.stat, as: 'decrease' },
        ],
        where: { name: { [Op.like]: name } },
    });
};

const getNatureByStats = async (increasedStat, decreasedStat) => {
    return await models.nature.findOne({
        include: [
            { model: models.stat, as: 'increase' },
            { model: models.stat, as: 'decrease' },
        ],
        where: {
            '$increase.id$': increasedStat,
            '$decrease.id$': decreasedStat,
        },
    });
};

const getRandomNature = async () => {
    return await models.nature.findOne({
        include: [
            { model: models.stat, as: 'increase' },
            { model: models.stat, as: 'decrease' },
        ],
        order: Sequelize.fn('Random'),
        limit: 1,
    });
};

const getNatureEmbed = (nature) => {
    const embed = new EmbedBuilder()
        .setTitle(`${nature.name}`)
        .setDescription(`+${nature.increase.abbreviation}, -${nature.decrease.abbreviation}`)
        .setColor('Random');

    if (nature.increase !== nature.decrease) {
        embed.addFields([
            { name: 'Likes', value: nature.increase.taste, inline: true },
            { name: 'Dislikes', value: nature.decrease.taste, inline: true },
        ]);
    }

    return embed;
};

const statChoices = [
    { name: 'HP', value: 1 },
    { name: 'Atk', value: 2 },
    { name: 'Def', value: 3 },
    { name: 'SpAtk', value: 4 },
    { name: 'SpDef', value: 5 },
    { name: 'Spd', value: 6 },
];

module.exports = {
    name: 'nature',
    description: 'Rolls a random Nature or defines it',
    options: [
        {
            name: 'random',
            description: 'Rolls a random Nature',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'define',
            description: 'Defines a Nature',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'by_name',
                    description: 'Returns a Nature using its name',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [{
                        name: 'name',
                        type: ApplicationCommandOptionType.String,
                        description: 'Name of the Nature',
                        required: true,
                    }],

                },
                {
                    name: 'by_stats',
                    description: 'Returns a Nature using its stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'increased_stat',
                            type: ApplicationCommandOptionType.Integer,
                            description: 'Stat increased by the Nature',
                            required: true,
                            choices: statChoices,
                        },
                        {
                            name: 'decreased_stat',
                            type: ApplicationCommandOptionType.Integer,
                            description: 'Stat decreased the Nature',
                            required: true,
                            choices: statChoices,
                        },
                    ],
                },
            ],
        },
    ],
    async execute(interaction) {
        console.log(interaction.options.getSubcommand());
        if (interaction.options.getSubcommand() === 'by_stats') {
            const nature = await getNatureByStats(
                interaction.options.getInteger('increased_stat'),
                interaction.options.getInteger('decreased_stat'),
            );
            await interaction.reply({
                embeds: [getNatureEmbed(nature)],
            });
        }
        else if (interaction.options.getSubcommand() === 'by_name') {
            await executeSimpleDefineCommand(interaction, getNatureByName, getNatureEmbed, models.nature);
        }
        else {
            await executeSimpleRandomCommand(interaction, getRandomNature, getNatureEmbed);
        }
    },
};
