const { Sequelize, Op } = require('sequelize');
const models = require('../../models');
const { ApplicationCommandOptionType } = require('discord.js');
const executeMove = require('../encyclopedia/move').execute;

const getRandomMove = async (metronomeOnly = true) => {
    const searchParams = {
        where: { name: { [Op.notLike] : '%[%]' } },
        include: [
            { model: models.type, as: 'type' },
            { model: models.category, as: 'category' },
            { model: models.damagebase, as: 'db' },
            { model: models.frequency, as: 'frequency' },
            { model: models.contesttype, as: 'contest_type' },
            { model: models.contesteffect, as: 'contest_effect' },
        ],
        order: Sequelize.fn('Random'),
        limit: 1,
    };
    if (metronomeOnly) { searchParams.where.metronome = 1; }
    return await models.move.findOne(searchParams);
};

module.exports = {
    name: 'metronome',
    description: 'Returns a random Move',
    options: [ {
        name: 'allow_all',
        type: ApplicationCommandOptionType.Boolean,
        description: 'Allow Moves that cannot be called by Metronome. No by default.',
        required: false,
    } ],
    async execute(interaction) {
        const move = await getRandomMove(!interaction.options.getBoolean('allow_all'));
        interaction.options._hoistedOptions.push(
            { name: 'name', type: ApplicationCommandOptionType.String, value: move.name },
        );
        await executeMove(interaction);
    },
};
