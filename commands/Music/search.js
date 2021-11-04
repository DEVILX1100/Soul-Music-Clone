const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
    name: `search`,
    category: `Music`,
    aliases: [`search`],
    description: `Searches a song from youtube`,
    usage: `search <Song / URL>`,
    cooldown: 5,
    parameters: {"type":"music", "activeplayer": false, "previoussong": false},
    run: async (client, message, args, guildData, player, prefix) => {
        try{
            //if no args return error
            if (!args[0]) {
                const opop = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} You need to give me a URL or a search term.`)
                return message.channel.send({embeds: [opop]})
            }
            //search the song for YOUTUBE
            playermanager(client, message, args, `search:youtube`);
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return message.channel.send({embeds: [emesdf]});
        }
    }
};