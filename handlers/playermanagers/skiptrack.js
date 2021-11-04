var {
  MessageEmbed
} = require("discord.js")
var ee = require("../../botconfig/embed.json")
var emoji = require("../../botconfig/emojis.json")
var config = require("../../botconfig/config.json")
var {
  format,
  delay,
  arrayMove
} = require("../functions")

//function for playling song + skipping
async function skiptrack(client, message, args, type) {
  var search = args.join(" ");
  try {
    var res;
    var player = client.manager.players.get(message.guild.id);
    if(!player)
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
    let state = player.state;
    if (state !== "CONNECTED") { 
      //set the variables
      player.connect();
    }
     
    // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
    
    if (type.split(":")[1] === "youtube" || type.split(":")[1] === "soundcloud")
    res = await client.manager.search({
      query: search,
      source: type.split(":")[1]
    }, message.author);
    else {
      res = await client.manager.search(search, message.author);
    }
    // Check the load type as this command is not that advanced for basics
    if (res.loadType === "LOAD_FAILED") throw res.exception;
    else if (res.loadType === "PLAYLIST_LOADED") {
      return require("../../handlers/playermanagers/playlist")(client, message, args, type);
    }

    if (!res.tracks[0]) {
      const yop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return message.channel.send({embeds: [yop]})
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {
      //set the variables
      player.connect();
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
      player.pause(false);
      if(message.member.voice.channel.type === "stage") {
        await message.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
      }
      //if its inside a request channel edit the msg
    }
    else if(!player.queue || !player.queue.current){
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      if(message.member.voice.channel.type === "stage") {
        await message.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
      }
      player.play();
      player.pause(false);
      //if its inside a request channel edit the msg
    }
    else {
      player.queue.add(res.tracks[0]);
      player.queue[player.queue.length - 1];
      //move the Song to the first position using my selfmade Function and save it on an array
      var QueueArray = arrayMove(player.queue, player.queue.length - 1, 0);
      //clear teh Queue
      player.queue.clear();
      //now add every old song again
      for (var track of QueueArray) {
        player.queue.add(track);
      }
      //skip the track
      player.stop();

      return;
    }
  } catch (e) {
    console.log(String(e.stack).red)
    const yoyop = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
    return message.channel.send({embeds: yoyop})
  }
}

module.exports = skiptrack;