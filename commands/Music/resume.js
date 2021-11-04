const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `resume`,
  category: `Music`,
  aliases: [`r`],
  description: `Resumes the Current paused Song`,
  usage: `resume`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //if its playing then return error
      if (player.playing) {
        const ppp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} The song is already resumed!\n\nYou can pause it with: \`${prefix}pause\``)
        return message.channel.send({embeds: [ppp]})
      }
      //pause the player
      player.pause(false);
      //send success message
      const ttt = new MessageEmbed()
      .setTitle(`${player.playing ? `${emoji.msg.playing} Resumed` : `${emoji.msg.pause} Paused`} the Player.`)
      .addField(`${emoji.msg.time} Progress: `, createBar(player))
      .setColor(ee.color)
      return message.channel.send({embeds: [ttt]});
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