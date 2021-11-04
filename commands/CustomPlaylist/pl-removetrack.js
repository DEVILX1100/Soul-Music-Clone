const {
  MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");

module.exports = {
name: `pl-removetrack`,
category: `CustomPlaylist`,
aliases: [`plremovetrack`, `pl-removet`, `plremovet`],
description: `delete your saved playlist`,
usage: `pl-create`,


run: async (client, message, args, guildData, player, prefix, userData) => {

  try {
      const Name = args[0]
      if (!Name) {
        const idksd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You didn't entered a playlist name\nUsage: \`${prefix}pl-removetrack <playlist name> <track number>\`\nName Information:\n\`Can be anything with maximum of 10 Letters\``)
        return message.channel.send({embeds: [idksd]});
      }
      if (Name.length > 10) {
        const sidc = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your playlist name is too long!\nMaximum Length is \`10\``)
        return message.channel.send({embeds: [sidc]});
      }
      let fetchList = await playlistSchema.findOne({
        userID: message.author.id,
        playlistName: Name
      });
      
      if (!fetchList) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
        return message.channel.send({embeds: [nopl]});  
      }

      const Options = args[1];
      if (!Options || isNaN(Options)) {
        const ddsde = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You didn't entered track number (the Track you want to remove (ID OF IT))\nSee all your Tracks: \`${prefix}pl-info ${Name}\`Usage: \`${prefix}pl-removetrack ${Name} <Song number>\``)
        return message.channel.send({embeds: [ddsde]})
      }

      let tracks = fetchList.playlistArray;
      if (Number(Options) >= tracks.length || Number(Options) < 0) {
        const dfre = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your provided track number is out of Range (\`0\` - \`${tracks.length-1}\`)\nSee all your Tracks: \`${prefix}pl-info showdetails ${Name}\`Usage: \`${prefix}pl-removetrack ${Name} <Song number>\``)
        return message.channel.send({embeds: [dfre]})
      }

      await playlistSchema.updateOne({
        userID: message.author.id,
        playlistName: Name
      },
      {
        $pull: {
          playlistArray: fetchList.playlistArray[Options]
        }
      });

      //return susccess message
      const isdfk  = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} Removed **${tracks[Options].title}** from \`${Name}\``)
      .setColor(ee.color)
      return message.channel.send({embeds: [isdfk]})

  } catch (e) {
    console.log(String(e.stack).bgRed)
    const emesdf = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setAuthor(`An Error Occurred`)
    .setDescription(`\`\`\`${e.message}\`\`\``);
    return message.channel.send({embeds: [emesdf]})
  }
}
}