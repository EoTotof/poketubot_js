const { MessageEmbed, MessageButton } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { normalizeString } = require('../../utils');
const { addLongField, getSuggestion, getLastPlaytestVersion, executeCommandInteraction } = require('../commandsUtils');

const getItems = async (name) => {
    return await models.item.findAll({
        where: { [Op.or]: [
            { name: { [Op.like]: name } },
            { name: { [Op.like]: `${name} [%` } },
        ] },
    });
};

const getItemEmbed = (item) => {
    const embed = new MessageEmbed()
        .setTitle(item.name)
        .setFooter('Item')
        .setColor('RANDOM');

    if (item.cost) { embed.setDescription(`${item.cost} ₽`);}

    const fields = [];
    if (item.modifier) {
        fields.push({
            name: 'Modifier',
            value: `${item.modifier >= 0 ? '+' : ''}${item.modifier}`,
            inline: true,
        });
    }
    if (item.additional_info) { fields.push({ name: 'Additional info', value: item.additional_info, inline: true }); }

    addLongField(fields, 'Description', item.description);

    embed.setFields(fields);
    return embed;
};

const getInteractionButtons = (items, timestamp) => {
    return items.map((item, index) => {
        const buttonLabel = item.name.match(/\[(.+)\]/) ? item.name.match(/\[(.+)\]/)[1] : '1.05';
        return new MessageButton()
            .setCustomId(`${timestamp}-item-${normalizeString(items[0].name)}-${index}`)
            .setLabel(buttonLabel)
            .setStyle('PRIMARY');
    });
};

const getInteractionFilter = (items, timestamp, interaction) => {
    return (i) => {
        return i.customId.startsWith(`${timestamp}-item-${normalizeString(items[0].name)}`) && i.user.id === interaction.user.id;
    };
};

const getInteractionOnCollect = (items) => {
    return async (i) => {
        const index = i.customId.split('-')[3];
        await i.update({
            embeds: [getItemEmbed(items[index])],
            components: [],
        });
    };
};

module.exports = {
    name: 'item',
    description: 'Defines an Item',
    options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'Name of the Item',
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
        const items = await getItems(interaction.options.getString('name'));
        if (items.length == 0) {
            const suggestion = await getSuggestion({
                searchValue: interaction.options.getString('name'),
                model: models.item,
                fields: ['name'],
                storeFields: ['name'],
                displayFunction: ((result) => result.name),
            });
            let nothingFoundMessage = `Nothing found for "${interaction.options.getString('name')}"`;
            nothingFoundMessage += suggestion.length === 0 ? '' : `\nDid you mean ${suggestion.join(', ')}?`;
            await interaction.reply({
                embeds: [new MessageEmbed().setDescription(nothingFoundMessage)],
                ephemeral: true,
            });
        }
        else if (items.length == 1) {
            if (interaction.pickup) {
                // Command was executed following a /pickup command
                await interaction.followUp({
                    embeds: [getItemEmbed(items[0])],
                });
            }
            else {
                await interaction.reply({
                    embeds: [getItemEmbed(items[0])],
                });
            }
        }
        else if (!interaction.options.getBoolean('choose_version')) {
            await interaction.reply({
                embeds: [getItemEmbed(getLastPlaytestVersion(items))],
            });
        }
        else {
            await executeCommandInteraction(
                false,
                items,
                timestamp,
                interaction,
                getInteractionButtons,
                `"${items[0].name}" version?`,
                getInteractionFilter(items, timestamp, interaction),
                getInteractionOnCollect(items),
            );
        }
    },
    otherExports: {
        getItems: getItems,
    },
};
