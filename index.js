const dotenv = require('dotenv');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { Parser } = require('expr-eval');

const { getRollEmbed } = require('./commands/rolls/roll').otherExports;
const { getCalcEmbed } = require('./commands/calculations/calc').otherExports;

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

// Import all commands from these directories
const commandDirectories = [
    './commands/calculations',
    './commands/encyclopedia',
    './commands/random',
    './commands/rolls',
];

commandDirectories.forEach((directory) => {
    const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
    commandFiles.forEach((file) => {
        // eslint-disable-next-line no-unused-vars
        const { otherExports, ...command } = require(`${directory}/${file}`);
        client.commands.set(command.name, command);
    });
});

// eslint-disable-next-line no-unused-vars
const commands = client.commands.map(({ execute, ...data }) => data);

client.once('ready', async () => {
    try {
        console.log('Started refreshing application slash commands');

        // await client.application?.commands.set(commands);

        commands.forEach(async (command) => {
            await client.guilds.cache.get('739095082661052458')?.commands.create(command);
        });


        console.log('Successfully reloaded application slash commands.');
    }
    catch (error) {
        console.error(error);
    }

});

client.on('messageCreate', message => {
    if (message.content.match(/^(?:[+-]?\d+)+$/g)) {
        message.reply({
            embeds: [getCalcEmbed(message.content, Parser.evaluate(message.content))],
        });
    }
    else if (message.content.match(/^(?:[+-]?\d+(?:[dD]\d+)?)+$/g)) {
        message.reply({
            embeds: [getRollEmbed(message.content)],
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (!client.commands.has(interaction.commandName)) return;

    try {
        await client.commands.get(interaction.commandName).execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    // console.log(interaction);
});

client.login(process.env.TOKEN);
