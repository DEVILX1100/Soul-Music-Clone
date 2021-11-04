const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playPlaylist = require("../../models/Playlists");
const playermanager = require(`../../handlers/playermanagers/custom-playlist`);
const {shuffle} = require("../../handlers/functions")

module.exports = {
  name: `pl-playshuffle`,
  category: `CustomPlaylist`,
  aliases: [`plplayshuffle`, `plshuffle`, `pl-shuffle`],
  description: `shuffle the playlist before playing it`,
  usage: `pl-playshuffle <name>`,
  
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
        const erme = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in \`${message.guild.channels.cache.get(player.voiceChannel).name}\` to use this command`)
        return message.channel.send({embeds: [erme]});  
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
        const erme = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`🔈 ${mechannel.name}\``);
        return message.channel.send({embeds: [erme]});  
      }

      let fetchList;
      fetchList = await playPlaylist.findOne({
        userID: message.author.id,
        playlistName: Name
      });
      
      if (!fetchList) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
        return message.channel.send({embeds: [nopl]});  
      }

      const sdfi = new MessageEmbed()
      .setColor(ee.color)
      .setDescription(`Attempting to Load ${fetchList.playlistArray.length} Tracks`)
      let tempmsg = await message.channel.send({embeds: [sdfi]})

      const shuffledQueue = shuffle(fetchList.playlistArray);
      playermanager(client, message, shuffledQueue);

      const tedm = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} Loaded ${fetchList.playlistArray.length} Tracks onto the current Queue`)
      .setColor(ee.color)
      tempmsg.edit({embeds: [tedm]})
      
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
