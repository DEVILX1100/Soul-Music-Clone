const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const playermanager = require(`../../handlers/playermanager`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `back`,
  category: `Music`,
  aliases: [`pre`, `previous`],
  description: `Plays previous song`,
  usage: `back`,
  cooldown: 10,
  parameters: {"type":"music", "activeplayer": true, "previoussong": true},
  run: async (client, message, args, guildData, player, prefix) => {
    try {

        let type = `skiptrack:youtube`;
        //if the previous was from soundcloud, then use type soundcloud
        if (player.queue.previous.uri.includes(`soundcloud`)) type = `skiptrack:soundcloud`
        //plays it
        playermanager(client, message, Array(player.queue.previous.uri), type);

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