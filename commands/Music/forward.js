const {
  MessageEmbed
} = require(`discord.js`)
const config = require(`../../botconfig/config.json`)
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `forward`,
  category: `Music`,
  aliases: [`seekforwards`, `fwd`],
  description: `Seeks a specific amount of Seconds forwards`,
  usage: `forward <Duration in Seconds>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {

      //get the seektime variable of the user input
      let seektime = Number(player.position) + 10000;
      //if the userinput is smaller then 0, then set the seektime to just the player.position
      if (10000 <= 0) seektime = Number(player.position);
      //if the seektime is too big, then set it 1 sec earlier
      if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
      //seek to the new Seek position
      player.seek(Number(seektime));
      //Send Success Message
      const ttt = new MessageEmbed()
      .setDescription(`${emoji.msg.forward} Forwarded the Song\n\nForwarded for \`10000 Seconds\` to: ${format(Number(player.position))}`)
      .addField(`${emoji.msg.time} Progress: `, createBar(player))
      .setColor("#2F3136")
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