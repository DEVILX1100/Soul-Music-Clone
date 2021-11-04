const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emoji = require(`../../botconfig/emojis.json`);
const ee = require("../../botconfig/embed.json");
const { autoplay } = require("../../handlers/functions");
module.exports = {
  name: "skip",
  category: "Music",
  aliases: ["s"],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  description: "Forces to skip the current song",
  usage: "skip",
  run: async (client, message, args, guildData, player, prefix) => {
    try{
   
      const { channel } = message.member.voice;
      //if the member is not in a channel, return
      if (!channel) {
        const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
        return message.channel.send({embeds: [opop]})
      }
      //get the player instance
      const player = client.manager.players.get(message.guild.id);
      //if no player available return error | aka not playing anything
      if (!player){
        if(message.guild.me.voice.channel) {
          const newPlayer = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
          })
          newPlayer.destroy();
          const pppp = new MessageEmbed()
          .setDescription(`${emoji.msg.stop} Stopped and left your Channel`)
          .setColor("#2F3136")
          return message.channel.send({embeds: [pppp]});
        }
        else {
          const opoppp = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} No song is currently playing in this guild.`)
          return message.channel.send({embeds: [opoppp]});
        }
      }
      
      //if not in the same channel as the player, return Error
      if (channel.id !== player.voiceChannel) {
        const noi = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\n\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
        return message.channel.send({embeds: [noi]})
      }
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return message.channel.send({embeds: [no]})
      }

      if(player.queue.size == 0) {
        if(player.get("autoplay")) {
          const idkd = new MessageEmbed()
          .setDescription(`${emoji.msg.skip_track} Skipped **${player.queue.current.title}** by \`${message.author.tag}\``)
          .setColor(ee.color)
          message.channel.send({embeds: [idkd]});
          return autoplay(client, player, "skip")
        } else {
          player.stop();
          const idkd = new MessageEmbed()
          .setDescription(`${emoji.msg.skip_track} Skipped **${player.queue.current.title}** by \`${message.author.tag}\``)
          .setColor(ee.color)
          return message.channel.send({embeds: [idkd]});
        }
      }

      player.stop();
      const idkd = new MessageEmbed()
      .setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`)
      .setColor(ee.color)
      return message.channel.send({embeds: [idkd]});

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