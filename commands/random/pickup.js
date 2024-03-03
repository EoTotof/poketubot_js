const { EmbedBuilder } = require('discord.js');
const { Sequelize, Op } = require('sequelize');
const models = require('../../models');
const { rollDice } = require('../../utils');
const { ApplicationCommandOptionType } = require('discord.js');
const executeItem = require('../encyclopedia/item').execute;

const getRandomItem = async (category) => {
    return await models.item.findOne({
        where: {
            pickup: category,
            name: { [Op.notLike] : '%[%]' },
        },
        order: Sequelize.fn('Random'),
        limit: 1,
    });
};

const getPickupEmbed = ({ roll = undefined, category, item = undefined }) => {
    const embed = new EmbedBuilder()
        .setTitle('Pickup')
        .setColor('Random');

    const fields = [];
    if (roll) {
        fields.push({ name: 'Roll', value: `${roll}`, inline: true });
    }
    if (category !== 'Nothing') {
        fields.push({ name: 'Category', value: category, inline: true });
        fields.push({ name: 'Found', value: item.name, inline: true });
    }
    else {
        fields.push({ name: '\u200b', value: 'Nothing was found.', inline: true });
    }
    return embed.addFields(fields);
};

module.exports = {
    name: 'pickup',
    description: 'Returns a random Item',
    options: [ {
        name: 'category',
        type: ApplicationCommandOptionType.String,
        description: 'Force the category of the found Item.',
        required: false,
        choices: [
            { name: 'X-Item', value: 'X-Item' },
            { name: 'Berry', value: 'Berry' },
            { name: 'Ball', value: 'Ball' },
            { name: 'Restorative', value: 'Restorative' },
            { name: 'Evolution', value: 'Evolution' },
            { name: 'Vitamin', value: 'Vitamin' },
            { name: 'Held', value: 'Held' },
            { name: 'TM', value: 'TM' },
        ],
    } ],
    async execute(interaction) {
        let categoryRoll;
        let category = interaction.options.getString('category');
        if (!category) {
            categoryRoll = rollDice(1, 20);
            if (categoryRoll < 6) { category = 'Nothing';}
            else if (categoryRoll < 8) { category = 'X-Item'; }
            else if (categoryRoll < 11) { category = 'Berry'; }
            else if (categoryRoll < 14) { category = 'Ball'; }
            else if (categoryRoll < 17) { category = 'Restorative'; }
            else if (categoryRoll < 18) { category = 'Evolution'; }
            else if (categoryRoll < 19) { category = 'Vitamin'; }
            else if (categoryRoll < 20) { category = 'Held'; }
            else { category = 'TM'; }
        }

        if (category === 'Nothing') {
            await interaction.reply({
                embeds: [getPickupEmbed({
                    roll: categoryRoll,
                    category: category,
                })],
            });
        }
        else {
            const item = await getRandomItem(category);
            await interaction.reply({
                embeds: [getPickupEmbed({
                    roll: categoryRoll,
                    category: category,
                    item: item,
                })],
            });

            interaction.options._hoistedOptions.push(
                { name: 'name', type: ApplicationCommandOptionType.String, value: item.name },
                { name: 'choose_version', type: ApplicationCommandOptionType.Boolean, value: true },
            );
            interaction.pickup = true;
            await executeItem(interaction);
        }
    },
};
