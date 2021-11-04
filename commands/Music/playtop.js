const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: `playtop`,
  category: `Music`,
  aliases: [`ptop`, `pt`],
  description: `Adds a song with the given name/url on the top of the queue`,
  usage: `play <Song / URL>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
        
      //if no args return error
      if (!args[0]) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to give me a URL or a Search term.`)
        return message.channel.send({embeds: [no]});
      }
      if (!player.queue.current) {
        const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} use \`${prefix}play\` command instead of \`${prefix}playtop\` command`)
        return message.channel.send({embeds: [opop]});
      }

      const cxxx = new MessageEmbed()
      .setColor("#2F3136")
      .setDescription(`**Searching** ${emoji.msg.search} \`${args.join(' ')}\``)
      const x = await message.channel.send({embeds: [cxxx]})
      setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)

      //play the SONG from YOUTUBE
      playermanager(client, message, args, `playtop:youtube`);
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