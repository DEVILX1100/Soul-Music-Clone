const {
    MessageEmbed 
} = require(`discord.js`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");
const { swap_pages2, format } = require("../../handlers/functions")

module.exports = {
  name: `pl-info`,
  category: `CustomPlaylist`,
  aliases: [`plinfo`],
  description: `gives you information of your saved playlist`,
  usage: `pl-info <playlist name>`,

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
      let fetchList = await playlistSchema.findOne({
        userID: message.author.id,
        playlistName: Name
      });
      if (!fetchList) {
        const nopsd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your Playlist is not existing!\nCreate it with: \`${prefix}pl-create ${Name}\``)
        return message.channel.send({embeds: [nopsd]});
      }

      let quelist = [];
      for (let i = 0; i < fetchList.playlistArray.length; i += 15) {
        let songs = fetchList.playlistArray.slice(i, i + 15);
        quelist.push(songs.map((track, index) => `**${i + ++index})** **${track.title.substr(0, 60)}** - \`${format(track.duration)}\``).join(`\n`))
      }
      let limit = quelist.length <= 5 ? quelist.length : 5
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`${fetchList.playlistName}  -  (${fetchList.playlistArray.length})`, message.guild.iconURL({
            dynamic: true
          }))
          .setFooter(ee.footertext, ee.footericon)
          .setColor("#2F3136")
          .setDescription(desc));
      }
      return swap_pages2(client, message, embeds)

    } catch (e) {
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]})
    }
  }
}