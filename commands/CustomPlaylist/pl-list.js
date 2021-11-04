const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const loadPlaylist  = require("../../models/Playlists");

module.exports = {
  name: `pl-list`,
  category: `CustomPlaylist`,
  aliases: [`pllist`, `plshow`, `pl-show`],
  description: `shows your all saved playlists`,
  usage: `pl-list`,

  
  run: async (client, message, args, guildData, player, prefix, userData) => {

    
    try {
      let member = message.author;
      let mention = message.mentions.users.first();
      if (mention) {
        args.shift();
        member = mention;
      }
      let fetchList;
      fetchList = await loadPlaylist.find({
        userID: member.id
      });
      if (!fetchList.length) {
        const idk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`Can not find any playlist that is saved by ${member.toString()}`)
        return message.channel.send({embeds: [idk]});
      }

      if (!args[0]) {
        const embeds2 = generateListEmbed(message, fetchList);
        return await message.channel.send({embeds: [embeds2]});
      }
  
 
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

function generateListEmbed(message, list) {
      const info = list.map((pl) => pl);
      //const info = current.map((pl) => `**${++j}** - \`${pl.playlistName}\` (${pl.playlistArray.length})`).join("\n");
      const ascii = require("ascii-table");
      let table = new ascii("Saved Playlists");
      table.setHeading("Playlists", "Tracks");
      
      info.forEach(x => table.addRow(x.playlistName, x.playlistArray.length))
      const embed = new MessageEmbed()
      .setAuthor(`${message.author.username}'s Playlists\n`, message.author.displayAvatarURL())
      .setDescription(`\`\`\`.--------------------.\n${table}\`\`\``)
      .setFooter(`Playlist (${list.length} / 10)`)
      .setTimestamp();
    return embed;
}