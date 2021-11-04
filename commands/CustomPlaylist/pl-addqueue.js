const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");

module.exports = {
  name: `pl-addqueue`,
  category: `CustomPlaylist`,
  aliases: [`pladdqueue`, `pl-addq`, `pladdq`],
  description: `adds current playing queue in your saved playlist`,
  usage: `pl-addqueue <playlist name>`,

  
  run: async (client, message, args, guildData, player, prefix, userData) => {

    try {
        const Name = args[0]
        if (!Name) {
          const emb = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You didn't entered a playlist name\nUsage: \`${prefix}pl-addqueue <playlist name>\`\nName Information:\n\`Can be anything with maximum of 10 Letters\``)
          return message.channel.send({embeds: [emb]});  
        }
  
        if (Name.length > 10) {
          const wer = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} Your playlist name is too long!\nMaximum Length is \`10\``)
          return message.channel.send({embeds: [wer]});
        }
        const { channel } = message.member.voice;
  
        //if the member is not in a channel, return
        if (!channel) {
          const eer = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
          return message.channel.send({embeds: [eer]});
        }
  
        const mechannel = message.guild.me.voice.channel;
        var player = client.manager.players.get(message.guild.id);
  
        if (player && channel.id !== player.voiceChannel) {
          const edf = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to be in \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use this command`)
          return message.channel.send({embeds: [edf]});  
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
          const embed = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`🔈 ${mechannel.name}\``)
          return message.channel.send({embeds: [embed]});
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
  
        const tracks = player.queue;
        //if there are no other tracks, information
        if (!player.queue.current) {
          const er = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} There is nothing playing!`)
          return message.channel.send({embeds: [er]});
        }
  
        let oldtracks = fetchList.playlistArray
        if (!Array.isArray(oldtracks)) oldtracks = [];
        const newtracks = [];

        for (const track of tracks) {
          newtracks.push({
            "title": track.title,
            "author": track.author,
            "duration": track.duration
          });
        }

        if (player.queue.current) newtracks.push({
          "title": player.queue.current.title,
          "author": player.queue.current,
          "duration": player.queue.current
        });
        
        let newqueue = oldtracks.concat(newtracks)

        await playlistSchema.updateOne(
          {
            userID: message.author.id,
            playlistName: Name
          },
          {
            $set: {
              playlistArray: newqueue
            }
          }
        );

        //return susccess message
        const susc  = new MessageEmbed()
        .setDescription(`${emoji.msg.SUCCESS} Added \`${newqueue.length - oldtracks.length}\` in \`${Name}\``)
        .setColor(ee.color)
        return message.channel.send({embeds: [susc]})

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