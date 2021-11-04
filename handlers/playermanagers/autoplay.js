var {
  MessageEmbed
} = require("discord.js")
var ee = require("../../botconfig/embed.json")
var emoji = require("../../botconfig/emojis.json")
var config = require("../../botconfig/config.json")

//function for playling song
async function autoplay(client, song, guildID, vcID, tcID) {

  var search = song;

  var author = client.users.cache.get(client.user.id)

  var res;
  var player = client.manager.players.get(guildID);
  if(!player)
    player = client.manager.create({
      guild: guildID,
      voiceChannel: vcID,
      textChannel: tcID,
      selfDeafen: config.settings.selfDeaf,
    });
  let state = player.state;
  if (state !== "CONNECTED") { 
    //set the variables
    player.connect();
  }
  try {

    res = await client.manager.search(search, author);
    // Check the load type as this command is not that advanced for basics
    if (res.loadType === "LOAD_FAILED") throw res.exception;
    else if (res.loadType === "PLAYLIST_LOADED") {
      throw {
        message: `Playlists are not supported with this command. Use !!playlist`
      };
    }

  } catch (e) {
    console.log(String(e.stack).red)
    const idk = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} There was an error while searching`)
    .setDescription(`\`\`\`${e.message}\`\`\``)
    .setFooter(ee.footertext, ee.footericon)
    return client.channels.cache.get(tcID).send({embeds: [idk]});
  }

  if (!res.tracks[0]) {
    console.log(`Found nothing for: ${search.substr(0, 256 - 3)}`)
  }

  //if the player is not connected, then connect and create things
  if (player.state !== "CONNECTED") {
    //set the variables
    //connect
    player.connect();
    //add track
    player.queue.add(res.tracks[0]);
    //play track
    const checkstage = await client.channels.fetch(vcID);
    if(checkstage.type === "stage") {
      await checkstage.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey)) 
    }
    player.play();
    player.pause(false);
    player.set(`autoplay`, true)
  }
  else if(!player.queue || !player.queue.current){
    //add track
    player.queue.add(res.tracks[0]);
    //play track
    const checkstage = await client.channels.fetch(vcID);
    if(checkstage.type === "stage") {
      await checkstage.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey)) 
    }
    player.play();
    player.pause(false);
    player.set(`autoplay`, true)
  }
  else {
    //add the latest track
    player.queue.add(res.tracks[0]);
    player.set(`autoplay`, true)
  }
}

module.exports = autoplay;