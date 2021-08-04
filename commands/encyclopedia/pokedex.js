const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const models = require('../../models');
const { normalizeString } = require('../../utils');


const getPokemons = async (nameOrNumber) => {
    let pokemons;
    if (!isNaN(parseInt(nameOrNumber))) {
        pokemons = await models.pokemon.findAll({
            where: { number:  parseInt(nameOrNumber) },
        });
    }
    else {
        pokemons = await models.pokemon.findAll();
        pokemons = pokemons.filter((pokemon_) => {
            return pokemon_.search_string.includes(`#${normalizeString(nameOrNumber)}#`);
        });
    }

    return pokemons;
};

const getPokedexEmbed = (pokemon, form = undefined) => {
    return new MessageEmbed()
        .setDescription(`${pokemon.name}${form ? ' - ' + pokemon.form + ' form' : '' }`)
        .setImage(
            process.env.DEX_URL
                .replace('<pokemon>', `${pokemon.number}`)
                .replace('<form>', form > 0 ? `-${form}` : ''),
        )
        .setColor('RANDOM');
};

const executePokemonCommand = async (commandID, embedGetter, interaction) => {
    const timestamp = Date.now();
    const pokemons = await getPokemons(interaction.options.getString('name_or_number'));
    if (pokemons.length == 0) {
        await interaction.reply({
            embeds: [new MessageEmbed().setDescription(`Nothing found for "${interaction.options.getString('name_or_number')}"`)],
        });
    }
    else if (pokemons.length == 1) {
        await interaction.reply({
            embeds: [embedGetter(pokemons[0])],
        });
    }
    else {
        const buttons = pokemons.map((pokemon, index) => {
            return new MessageButton()
                .setCustomId(`${timestamp}-${commandID}-${pokemons[0].number}-${index}`)
                .setLabel(pokemon.form)
                .setStyle('PRIMARY');
        });

        const actionRows = [];

        for (let i = 0; i < buttons.length; i += 5) {
            actionRows.push(new MessageActionRow().addComponents(buttons.slice(i, i + 5)));
        }

        await interaction.reply({
            embeds: [new MessageEmbed().setDescription(`${pokemons[0].name} form?`)],
            components: actionRows,
        });

        const filter = ((i) => {
            return i.customId.startsWith(`${timestamp}-${commandID}-${pokemons[0].number}`) && i.user.id === interaction.user.id;
        });

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (i) => {
            const form = i.customId.split('-')[3];
            await i.update({
                embeds: [embedGetter(pokemons[form], form)],
                components: [],
            });
        });

        collector.on('end', async (collected) => {
            if (collected.size == 0) {
                await interaction.editReply({
                    embeds: [new MessageEmbed().setDescription('The command has expired.')],
                    components: [],
                });
            }
        });
    }

};
module.exports = {
    name: 'pokedex',
    description: 'Displays the Pokédex entry of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: 'STRING',
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        await executePokemonCommand('pokedex', getPokedexEmbed, interaction);
    },
    otherExports: {
        getPokemons: getPokemons,
        executePokemonCommand: executePokemonCommand,
    },
};