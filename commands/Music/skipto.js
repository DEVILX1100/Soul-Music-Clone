const {
  MessageEmbed
} = require(`discord.js`)
const config = require(`../../botconfig/config.json`)
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `skipto`,
  category: `Music`,
  aliases: [`skipto`],
  description: `Skips to a specific Track`,
  usage: `jump <track number>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //if no args send error plus example
      if (!args[0]) {
        const ttt = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please include to which track you want to jump\n\nExample: \`jump ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\``)
        return message.channel.send({embeds: [ttt]})
      }
      //if userinput is not a Number
      if (isNaN(args[0])) {
        const yyy = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} It has to be a queue **Number**`)
        return message.channel.send({embeds: [yyy]})
      }
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size) {
        const rrt = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} That song is not in the queue, sorry!`)
        return message.channel.send({embeds: [rrt]})
      }
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop()
      //Send Success Message
      const popo = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} Jumped to the: \`${args[0]}\` Song\n\n${emoji.msg.skip_track} Skipped \`${Number(args[0])}\` Songs`)
      .setColor("#2F3136")
      return message.channel.send({embeds: [popo]});
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