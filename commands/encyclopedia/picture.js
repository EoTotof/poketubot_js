const { MessageEmbed } = require('discord.js');
const { otherExports } = require('./pokedex.js');

const getPictureEmbed = (pokemon, form = undefined) => {
    return new MessageEmbed()
        .setDescription(`${pokemon.name}${form ? ' - ' + pokemon.form + ' form' : '' }`)
        .setImage(
            process.env.PIC_URL
                .replace('<pokemon>', `${pokemon.number.toString().padStart(3, '0')}`)
                .replace('<form>', form > 0 ? `-${form}` : ''),
        )
        .setColor('RANDOM');
};

module.exports = {
    name: 'picture',
    description: 'Displays the picture of a Pokémon',
    options: [{
        name: 'name_or_number',
        type: 'STRING',
        description: 'Name (English, French, German or Japanese) or number of the Pokémon',
        required: true,
    }],
    async execute(interaction) {
        await otherExports.executePokemonCommand('picture', getPictureEmbed, interaction);
    },
};