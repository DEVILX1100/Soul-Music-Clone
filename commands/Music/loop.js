const {
  MessageEmbed
} = require(`discord.js`);
const DBL = require('@top-gg/sdk');
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `loop`,
  category: `Music`,
  aliases: [`repeat`, `l`],
  description: `Repeats the current song`,
  usage: `loopsong`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {
     

      //if no args send error
      if (!args[0]) {
        const tdk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(`${emoji.msg.ERROR} Please add your method!`)
        .setDescription(`\`loop song\`\nIt will loop the current **Track** endlessly!\n\`loop queue\`\nIt will loop the whole Queue will be repeated endlessly!`)
        return message.channel.send({embeds: [tdk]})
      }
      //if arg is somehow song / track
      if (args[0].toLowerCase() === `song` || args[0].toLowerCase() === `track` || args[0].toLowerCase() === `s` || args[0].toLowerCase() === `t`) {
        //Create the Embed
        let embed = new MessageEmbed()
        .setDescription(`${emoji.msg.repeat_mode} Track loop ${player.trackRepeat ? `Disabled` : `Enabled`}`)
        .setColor("#2F3136")
        //If Queue loop is enabled add embed info + disable it
        if (player.queueRepeat) {
          player.setQueueRepeat(false);
        }
        //toggle track repeat to the reverse old mode
        player.setTrackRepeat(!player.trackRepeat);
        //Send Success Message
        return message.channel.send({embeds: [embed]})
      }
      //if input is queue
      else if (args[0].toLowerCase() === `queue` || args[0].toLowerCase() === `qu` || args[0].toLowerCase() === `q`) {
        //Create the Embed
        let embed = new MessageEmbed()
          .setDescription(`${emoji.msg.repeat_mode} Queue loop ${player.queueRepeat ? `Disabled` : `Enabled`}`)
          .setColor("#2F3136")
        //If Track loop is enabled add embed info + disable it
        if (player.trackRepeat) {
          player.setTrackRepeat(false);
        }
        //toggle queue repeat to the reverse old mode
        player.setQueueRepeat(!player.queueRepeat);
        //Send Success Message
        return message.channel.send({embeds: [embed]});
      }
      //if no valid inputs, send error
      else {
        const ror = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(`${emoji.msg.ERROR} Please add your method!`)
        .setDescription(`\`loop song\`\nIt will loop the current **Track** endlessly!\n\`loop queue\`\nIt will loop the whole Queue will be repeated endlessly!`)
        return message.channel.send({embeds: [ror]});
      }
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