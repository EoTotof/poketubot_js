const { EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const models = require('../../models');
const { ApplicationCommandOptionType } = require('discord.js');

const getType = async (name) => {
    return await models.type.findOne({
        where: { name: { [Op.like]: name } },
        include: [
            // Type effectiveness as defending Type
            {
                model: models.typeeffectiveness,
                as: 'typeeffectivenesses',
                include: { model: models.type, as: 'attacking' },
            },
            // Type effectiveness as attacking Type
            {
                model: models.typeeffectiveness,
                as: 'attacking_typeeffectivenesses',
                include: { model: models.type, as: 'defending' },
            },
        ],
    });
};

const getTypeEmbed = (type) => {
    const embed = new EmbedBuilder()
        .setTitle(`${type.name} Type`)
        .setColor('Random');

    const [superEffective, notVeryEffective, ineffective] = [2, 0.5, 0].map((value) => {
        return type.attacking_typeeffectivenesses
            .filter((typeeff) => typeeff.effectiveness === value)
            .map((typeeff) => typeeff.defending.name)
            .join(', ');
    });

    const [weak, resistant, immune] = [2, 0.5, 0].map((value) => {
        return type.typeeffectivenesses
            .filter((typeeff) => typeeff.effectiveness === value)
            .map((typeeff) => typeeff.attacking.name)
            .join(', ');
    });

    let attackingFieldValue = '';
    if (superEffective.length > 0) { attackingFieldValue += `\nSuper Effective (x 2) on: ${superEffective}`;}
    if (notVeryEffective.length > 0) { attackingFieldValue += `\nNot very Effective (x 0.5) on: ${notVeryEffective}`;}
    if (ineffective.length > 0) { attackingFieldValue += `\nCompletely ineffective (x 0) on: ${ineffective}`;}

    let defendingFieldValue = '';
    if (weak.length > 0) { defendingFieldValue += `\nWeak (x 2) against: ${weak}`;}
    if (resistant.length > 0) { defendingFieldValue += `\nResistant (x 0.5) to: ${resistant}`;}
    if (immune.length > 0) { defendingFieldValue += `\nImmune (x 0) to: ${immune}`;}

    const fields = [];
    fields.push({ name: `Attacking ${type.name} Move`, value: attackingFieldValue });
    fields.push({ name: `Defending ${type.name} Pokémon`, value: defendingFieldValue });

    return embed.setFields(fields);
};


module.exports = {
    name: 'type',
    description: 'Displays the effectiveness of and against a given Type',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the Type',
        required: true,
    }],
    async execute(interaction) {
        const type = await getType(interaction.options.getString('name'));
        if (!type) {
            await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`Nothing found for "${interaction.options.getString('name')}"`)],
            });
        }
        else {
            await interaction.reply({
                embeds: [getTypeEmbed(type)],
            });
        }
    },
};
