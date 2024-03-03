const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// TODO rename all to getter to make requires more generic
const { getAbilities } = require('./ability').otherExports;
const { getAffliction } = require('./affliction').otherExports;
const { getCapability } = require('./capability').otherExports;
const { getContestEffect } = require('./contest').otherExports;
const { getEdge } = require('./edge').otherExports;
const { getFeature } = require('./feature').otherExports;
const { getItems } = require('./item').otherExports;
const { getKeyword } = require('./keyword').otherExports;
const { getCombatManeuver } = require('./maneuver').otherExports;
const { getMoves } = require('./move').otherExports;
const { getPokemons } = require('./pokedex').otherExports;
const { getPokeEdge } = require('./pokeedge').otherExports;
const { getWeatherCondition } = require('./weather').otherExports;

const allCommands = [
    { command: 'ability', getter: getAbilities, execute: require('./ability').execute },
    { command: 'feature', getter: getFeature, execute: require('./feature').execute },
    { command: 'edge', getter: getEdge, execute: require('./edge').execute },
    { command: 'pokeedge', getter: getPokeEdge, execute: require('./pokeedge').execute },
    { command: 'capability', getter: getCapability, execute: require('./capability').execute },
    { command: 'maneuver', getter: getCombatManeuver, execute: require('./maneuver').execute },
    { command: 'keyword', getter: getKeyword, execute: require('./keyword').execute },
    { command: 'affliction', getter: getAffliction, execute: require('./affliction').execute },
    { command: 'weather', getter: getWeatherCondition, execute: require('./weather').execute },
    { command: 'pokedex', getter: getPokemons, execute: require('./pokedex').execute },
    { command: 'move', getter: getMoves, execute: require('./move').execute },
    { command: 'item', getter: getItems, execute: require('./item').execute },
    { command: 'contest', getter: getContestEffect, execute: require('./contest').execute },
];

module.exports = {
    name: 'definition',
    description: 'Tries to find a definition in all available commands',
    options: [{
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name to look for',
        required: true,
    }],
    async execute(interaction) {
        const positiveResults = [];

        // TODO keep order of results
        await Promise.all(
            allCommands.map(async ({ command, getter }) => {
                return getter(interaction.options.getString('name'))
                    .then((result) => {
                        if (result !== null && (!Array.isArray(result) || (Array.isArray(result) && result.length > 0))) {
                            positiveResults.push(command);
                        }
                    });
            }),
        );
        if (positiveResults.length == 0) {
            await interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`Nothing found for "${interaction.options.getString('name')}"`)],
            });
        }
        else {
            interaction.options._hoistedOptions.push(
                { name: 'name_or_number', type: ApplicationCommandOptionType.String, value: interaction.options.getString('name') },
            );

            const executeCommand = allCommands.find(({ command }) => command === positiveResults[0]).execute;
            await executeCommand(interaction);
        }

        if (positiveResults.length > 1) {
            const otherCommands = positiveResults.slice(1).map((x) => `/${x}`).join(', ');
            await interaction.followUp({
                embeds: [new EmbedBuilder().setDescription(`Other results were found for the following commands:\n${otherCommands}`)],
            });
        }
    },
};
