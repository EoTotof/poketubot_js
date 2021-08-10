const { MessageEmbed, MessageButton } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { normalizeString } = require('../../utils');
const { addLongField, getSuggestion, getLastPlaytestVersion, executeCommandInteraction } = require('../commandsUtils');

const getAbilities = async (name) => {
    return await models.ability.findAll({
        where: { [Op.or]: [
            { name: { [Op.like]: name } },
            { name: { [Op.like]: `${name} [%` } },
        ] },
        include: [
            { model: models.action, as: 'action' },
            { model: models.frequency, as: 'frequency' },
            { model: models.keyword, as: 'keyword' },
        ],
    });
};

const getAbilityEmbed = (ability) => {
    const embed = new MessageEmbed()
        .setTitle(ability.name)
        .setFooter('Ability')
        .setColor('RANDOM');

    const fields = [];

    if (ability.frequency) { fields.push({ name: 'Frequency', value: ability.frequency.value, inline: true }); }
    if (ability.action) {
        let actionName = `${ability.action.name} Action`;
        if (ability.keyword) {
            actionName += `, ${ability.keyword.name}`;
        }
        fields.push({ name: actionName, value: '\u200b', inline: true });
    }
    if (ability.trigger) { fields.push({ name: 'Trigger', value: ability.trigger, inline: true }); }
    if (ability.target) { fields.push({ name: 'Target', value: ability.target, inline: true }); }

    addLongField(fields, 'Effect', ability.effect);

    embed.setFields(fields);
    return embed;
};

const getInteractionButtons = (abilities, timestamp) => {
    return abilities.map((ability, index) => {
        const buttonLabel = ability.name.match(/\[(.+)\]/) ? ability.name.match(/\[(.+)\]/)[1] : '1.05';
        return new MessageButton()
            .setCustomId(`${timestamp}-ability-${normalizeString(abilities[0].name)}-${index}`)
            .setLabel(buttonLabel)
            .setStyle('PRIMARY');
    });
};

const getInteractionFilter = (abilities, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-ability-${normalizeString(abilities[0].name)}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (abilities) => {
    return async (i) => {
        const index = i.customId.split('-')[3];
        await i.update({
            embeds: [getAbilityEmbed(abilities[index])],
            components: [],
        });
    };
};

module.exports = {
    name: 'ability',
    description: 'Defines an Ability',
    options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'Name of the Ability',
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
        const abilities = await getAbilities(interaction.options.getString('name'));
        if (abilities.length == 0) {
            const suggestion = await getSuggestion({
                searchValue: interaction.options.getString('name'),
                model: models.ability,
                fields: ['name'],
                storeFields: ['name'],
                displayFunction: ((result) => result.name),
            });
            let nothingFoundMessage = `Nothing found for "${interaction.options.getString('name')}"`;
            nothingFoundMessage += suggestion.length === 0 ? '' : `\nDid you mean ${suggestion.join(', ')}?`;
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
            });
        }
        else if (abilities.length == 1) {
            await interaction.reply({
                embeds: [getAbilityEmbed(abilities[0])],
            });
        }
        else if (!interaction.options.getBoolean('choose_version')) {
            await interaction.reply({
                embeds: [getAbilityEmbed(getLastPlaytestVersion(abilities))],
            });
        }
        else {
            await executeCommandInteraction(
                abilities,
                timestamp,
                interaction,
                getInteractionButtons,
                `"${abilities[0].name}" version?`,
                getInteractionFilter(abilities, timestamp, interaction),
                getInteractionOnCollect(abilities),
            );
        }
    },
    otherExports: {
        getAbilities: getAbilities,
    },
};
