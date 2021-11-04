const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");

module.exports = {
  name: `pl-removedupes`,
  category: `CustomPlaylist`,
  aliases: [`plremovedupes`, `pl-removeduplicates`, `plremoveduplicates`],
  description: `delete your saved playlist`,
  usage: `pl-create`,

  
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
          const nopl = new MessageEmbed()
          .setColor("RED")
          .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
          return message.channel.send({embeds: [nopl]});  
        }
  
        let oldtracks = fetchList.playlistArray;
        if (!Array.isArray(oldtracks)) {
          const difg  = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} Your Saved-Queue ${Name} is Empty!\nAdd the current **Queue** onto it: \`${prefix}pl-addqueue ${Name}\`\nAdd the current **Track** onto it: \`${prefix}pl-addcurrentt ${Name}\``)
          return message.channel.send({embeds: [difg]});
        }

        let counter = 0;
        const newtracks = [];
        for (let i = 0; i < oldtracks.length; i++) {
          let exists = false;
          for (j = 0; j < newtracks.length; j++) {
            if (oldtracks[i].title === newtracks[j].title) {
              exists = true;
              counter++;
              break;
            }
          }
          if (!exists) {
            newtracks.push(oldtracks[i]);
          }
        }

        await playlistSchema.updateOne({
          userID: message.author.id,
          playlistName: Name
        },
        {
          $set: {
            playlistArray: newtracks
          }
        });

        //return susccess message
        const idd = new MessageEmbed()
        .setDescription(`${emoji.msg.SUCCESS} Removed \`${counter}\` from \`${Name}\``)
        .setColor(ee.color)
        return message.channel.send({embeds: [idd]})

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