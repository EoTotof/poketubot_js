const { MessageEmbed } = require('discord.js');
const { sliceString } = require('../utils');

const executeSimpleDefineCommand = async (interaction, getter, embedGetter) => {
    const object = await getter(interaction.options.getString('name'));
    if (!object) {
        await interaction.reply({
            embeds: [new MessageEmbed().setDescription(`Nothing found for "${interaction.options.getString('name')}"`)],
        });
    }
    else {
        await interaction.reply({
            embeds: [embedGetter(object)],
        });
    }
};

const addLongField = (fields, name, value) => {
    sliceString(value, 1024, '\n\n')
        .forEach((slice, index) => {
            const sliceName = index === 0 ? name : '\u200b';
            fields.push({ name: sliceName, value: slice });
        });
};

module.exports = {
    executeSimpleDefineCommand: executeSimpleDefineCommand,
    addLongField: addLongField,
};