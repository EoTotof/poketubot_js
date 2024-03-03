const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { executeSimpleDefineCommand, addLongField } = require('../commandsUtils');
const { ApplicationCommandOptionType } = require('discord.js');

const getFeature = async (name) => {
    return await models.feature.findOne({
        where: { name: { [Op.like]: name } },
        include: [
            // Children of a Branch Feature
            { model: models.feature, as: 'features' },
            // Parent Class Feature
            { model: models.feature, as: 'class_feature' },
            // Children of a Class Feature
            { model: models.feature, as: 'class_feature_features' },
            { model: models.action, as: 'action' },
            { model: models.frequency, as: 'frequency' },
        ],
    });
};

const getFeatureEmbed = (feature) => {
    const embed = new EmbedBuilder()
        .setTitle(feature.name)
        .setFooter({ text:`Feature${feature.class_feature ? ` - ${feature.class_feature.name} Class` : ''}` })
        .setColor('Random');
    if (feature.tags) { embed.setDescription(feature.tags); }

    const fields = [];
    if (feature.prerequisites) { fields.push({ name: 'Prerequisites', value: `${feature.prerequisites}` }); }
    if (feature.frequency) { fields.push({ name: 'Frequency', value: `${feature.frequency.value}`, inline: true }); }
    if (feature.ap_cost) { fields.push({ name: feature.ap_cost, value: '\u200b', inline: true }); }
    if (feature.action) { fields.push({ name: `${feature.action.name} Action`, value: '\u200b', inline: true }); }

    addLongField(fields, 'Effect', feature.effect);

    if (feature.class_feature_features.length > 0) {
        const classFeaturesString = feature.class_feature_features
            .map((feat) => feat.name)
            .join(', ');
        fields.push({ name: 'Class Features', value: classFeaturesString });
    }
    if (feature.features.length > 0) {
        const branchFeaturesString = feature.features
            .map((feat) => feat.name)
            .join(', ');
        fields.push({ name: 'Branch Features', value: branchFeaturesString });
    }

    return embed.setFields(fields);
};


module.exports = {
    name: 'feature',
    description: 'Defines a Feature',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Feature',
        required: true,
    }],
    async execute(interaction) {
        await executeSimpleDefineCommand(interaction, getFeature, getFeatureEmbed, models.feature);
    },
    otherExports: {
        getFeature: getFeature,
    },
};
