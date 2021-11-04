const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const delPlaylist = require("../../models/Playlists");

module.exports = {
  name: `pl-delete`,
  category: `CustomPlaylist`,
  aliases: [`pldelete`, `pl-remove`, `plremove`],
  description: `delete your saved playlist`,
  usage: `pl-delete <playlist name>`,

  
  run: async (client, message, args, guildData, player, prefix, userData) => {

    try {
      const Name = args[0]
      if (!Name) {
        const idksd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You didn't entered a playlist name\nUsage: \`${prefix}pl-delete <playlist name>\`\nName Information:\n\`Can be anything with maximum of 10 Letters\``)
        return message.channel.send({embeds: [idksd]});
      }
      if (Name.length > 10) {
        const sidc = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your playlist name is too long!\nMaximum Length is \`10\``)
        return message.channel.send({embeds: [sidc]});
      }
      let fetchList = await delPlaylist.find({
        userID: message.author.id,
        playlistName: Name
      });
      if (fetchList.length == 0) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} You don't have a playlist with that name`)
        return message.channel.send({embeds: [nopl]});
      }
         
      delPlaylist.deleteOne(
        {
          userID: message.author.id,
          playlistName: Name
        },
        function (err) {
          if (err) console.log(err);
        }
      )

      const success = new MessageEmbed()
      .setColor(ee.color)
      .setDescription(`${emoji.msg.SUCCESS} Successfully deleted \`${Name}\` playlist`)
      return message.channel.send({embeds: [success]})
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