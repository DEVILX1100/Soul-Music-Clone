const {
    MessageEmbed 
} = require(`discord.js`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playPlaylist = require("../../models/Playlists");
const playermanager = require(`../../handlers/playermanagers/custom-playlist`);

module.exports = {
  name: `pl-load`,
  category: `CustomPlaylist`,
  aliases: [`plload`, `pl-play`, `plplay`],
  description: `play the saved playlist`,
  usage: `pl-load <playlist name>`,

  run:  (client, message, args, guildData, player, prefix, userData) => {

    try {
      
      
      const { channel } = message.member.voice;

      //if the member is not in a channel, return
      if (!channel) {
        const novc = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
        return message.channel.send({embeds: [novc]});
      }

      const mechannel = message.guild.me.voice.channel;
      var player = client.manager.players.get(message.guild.id);

      if (player && channel.id !== player.voiceChannel) {
        const same = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
        return message.channel.send({embeds: [same]});  
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
        const need = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in \`🔈 ${mechannel.name}\` to use this command`)
        return message.channel.send({embeds: [need]});

        
      }

      const plname = args[0];
      let fetchList = playPlaylist.findOne({
        userID: message.author.id,
        playlistName: plname
      });
      
      if (!fetchList) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
        return message.channel.send({embeds: [nopl]});  
      }

        const isdk = new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`Attempting to Load Tracks From The Playlist`)
        message.channel.send({ embeds: [isdk] }).then(tempmsg => {
            playermanager(client, message, fetchList.playlistArray)

            const newembed = new MessageEmbed()
            .setDescription(`${emoji.msg.SUCCESS} Loaded The Tracks onto the current Queue`)
            .setColor(ee.color)
            tempmsg.edit({embeds: [newembed]})
        })
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]})
    }
  }
};