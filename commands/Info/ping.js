const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "ping",
  category: "Info",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Gives you information on how fast the Bot can respond to you",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
        
      const embed = new MessageEmbed()
      .setDescription('`Pinging...`')
      .setColor(ee.color);    
      const msg = await message.channel.send({embeds: [embed]});
      const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; // Check if edited
      const latency = `  ${Math.floor(msg.createdTimestamp - timestamp)} ms`;
      const apiLatency = `  ${message.client.ws.ping - 19} ms`;
      embed.setDescription(`\`\`\`nim\nWebsocket Latency :: ${latency}\nAPI Latency       :: ${apiLatency}\`\`\``)
      .setAuthor(client.user.username, client.user.displayAvatarURL(), config.links.opmusicinv)
      msg.edit({embeds: [embed]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
}