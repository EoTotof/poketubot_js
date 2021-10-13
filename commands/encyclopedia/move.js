const { MessageEmbed, MessageButton } = require('discord.js');
const models = require('../../models');
const { normalizeString } = require('../../utils');
const { getSuggestion, executeCommandInteraction, getLastPlaytestVersion } = require('../commandsUtils');

const getMoves = async (name) => {
    const moves = await models.move.findAll({ include: [
        { model: models.type, as: 'type' },
        { model: models.category, as: 'category' },
        { model: models.damagebase, as: 'db' },
        { model: models.frequency, as: 'frequency' },
        { model: models.contesttype, as: 'contest_type' },
        { model: models.contesteffect, as: 'contest_effect' },
    ] });
    return moves.filter((move) => {
        return move.search_string.includes(`#${normalizeString(name)}#`);
    });
};

const getMoveEmbed = (move) => {
    const embed = new MessageEmbed()
        .setTitle(move.name)
        .setDescription(`*${move.french_name}*`)
        .setFooter('Move')
        .setColor('RANDOM');

    const fields = [
        { name: 'Type', value: move.type.name, inline: true },
        { name: 'Class', value: move.category.name, inline: true },
    ];
    if (move.db) { fields.push({ name: `DB ${move.db.value}`, value: move.db.dice_roll, inline: true }); }
    if (move.frequency) { fields.push({ name: 'Frequency', value: move.frequency.value, inline: true }); }
    if (move.accuracy) { fields.push({ name: 'AC', value: `${move.accuracy}`, inline: true }); }
    if (move.range) { fields.push({ name: 'Range', value: move.range, inline: true }); }
    if (move.contest_type) { fields.push({ name: 'Contest Stats', value: `${move.contest_type.name} - ${move.contest_effect.name}` }); }
    if (move.effect && move.effect != '--') { fields.push({ name: 'Effect', value: move.effect }); }

    return embed.setFields(fields);
};

const getInteractionButtons = (moves, timestamp) => {
    return moves.map((move, index) => {
        const buttonLabel = move.name.match(/\[(.+)\]/) ? move.name.match(/\[(.+)\]/)[1] : '1.05';
        return new MessageButton()
            .setCustomId(`${timestamp}-move-${normalizeString(moves[0].name)}-${index}`)
            .setLabel(buttonLabel)
            .setStyle('PRIMARY');
    });
};

const getInteractionFilter = (moves, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-move-${normalizeString(moves[0].name)}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (moves) => {
    return async (i) => {
        const index = i.customId.split('-')[3];
        await i.update({
            embeds: [getMoveEmbed(moves[index])],
            components: [],
        });
    };
};

module.exports = {
    name: 'move',
    description: 'Defines a Move',
    options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'Name of the Move (English or French)',
            required: true,
        },
        {
            name: 'choose_version',
            type: 'BOOLEAN',
            description: 'Manually select the version if a playtest exists. Latest version by default.',
            required: false,
        },
    ],
    async execute(interaction) {
        const timestamp = Date.now();
        const moves = await getMoves(interaction.options.getString('name'));
        if (moves.length == 0) {
            const suggestion = await getSuggestion({
                searchValue: interaction.options.getString('name'),
                model: models.move,
                fields: ['name', 'french_name'],
                storeFields: ['name', 'french_name'],
                displayFunction: ((result) => `"${result.name}"${ result.french_name ? ` (${result.french_name})` : ''}`),
            });
            let nothingFoundMessage = `Nothing found for "${interaction.options.getString('name')}"`;
            nothingFoundMessage += suggestion.length === 0 ? '' : `\nDid you mean ${suggestion.join(', ')}?`;
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
                ephemeral: true,
            });
        }
        else if (moves.length == 1) {
            await interaction.reply({
                embeds: [getMoveEmbed(moves[0])],
            });
        }
        else if (!interaction.options.getBoolean('choose_version')) {
            await interaction.reply({
                embeds: [getMoveEmbed(getLastPlaytestVersion(moves))],
            });
        }
        else {
            await executeCommandInteraction(
                false,
                moves,
                timestamp,
                interaction,
                getInteractionButtons,
                `"${moves[0].name}" version?`,
                getInteractionFilter(moves, timestamp, interaction),
                getInteractionOnCollect(moves),
            );
        }
    },
    otherExports: {
        getMoves: getMoves,
    },
};
