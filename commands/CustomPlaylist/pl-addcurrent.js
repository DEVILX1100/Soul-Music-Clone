const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");

module.exports = {
  name: `pl-addcurrent`,
  category: `CustomPlaylist`,
  aliases: [`pl-addc`, `pladdc`],
  description: `adds current playing song in your saved playlist`,
  usage: `pl-addcurrent <playlist name>`,

  
  run: async (client, message, args, guildData, player, prefix, userData) => {

    try {
        const Name = args[0]
        if (!Name) {
          const embed = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You didn't entered a playlist name\nUsage: \`${prefix}pl-addcurrent <playlist name>\`\nName Information:\n\`Can be anything with maximum of 10 Letters\``)
          return message.channel.send({embeds: [embed]});
        }
  
        if (Name.length > 10) {
          const embed = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} Your playlist name is too long!\nMaximum Length is \`10\``)
          return message.channel.send({embeds: [embed]});
        }
        const { channel } = message.member.voice;
  
        //if the member is not in a channel, return
        if (!channel) {
          const sxs = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
          return message.channel.send({embeds: [sxs]});
        }
  
        const mechannel = message.guild.me.voice.channel;
        var player = client.manager.players.get(message.guild.id);
  
        if (player && channel.id !== player.voiceChannel) {
          const wdc = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
          return message.channel.send({embeds: [wdc]});
        }
  
        if(!player && mechannel) {
          const newPlayer = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,    
          })
          newPlayer.destroy();
        }
  
        if (mechannel && channel.id !== mechannel.id) {
          const wd = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to be in \`🔈 ${mechannel.name}\ to use this command`)
          return message.channel.send({embeds: [wd]});
        }
  
        let fetchList;
        fetchList = await playlistSchema.findOne({
          userID: message.author.id,
          playlistName: Name
        });
        
        if (!fetchList) {
          const nopl = new MessageEmbed()
          .setColor("RED")
          .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
          return message.channel.send({embeds: [nopl]});  
        }
  
        const track = player.queue.current;
        //if there are no other tracks, information
        if (!track) {
          const idk = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} There is nothing playing!`)
          return message.channel.send({embeds: [idk]});
        }
  
        let oldtracks = fetchList.playlistArray
        if (!Array.isArray(oldtracks)) oldtracks = [];
        //add the track
        oldtracks.push({
          "title": track.title,
          "url": track.uri
        })

        await playlistSchema.updateOne(
          {
            userID: message.author.id,
            playlistName: Name
          },
          {
            $push: {
              playlistArray: {
                title: track.title,
                author: track.author,
                duration: track.duration
              }
            }
          }
        );

        //return susccess message
        const errrrr = new MessageEmbed()
        .setDescription(`${emoji.msg.SUCCESS} Added [${track.title.substr(0, 256)}](${track.uri})) in \`${Name}\``)
        .setColor(ee.color)
        return message.channel.send({embeds: [errrrr]})

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