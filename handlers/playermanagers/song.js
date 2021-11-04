var { MessageEmbed } = require("discord.js")
var ee = require("../../botconfig/embed.json")
var emoji = require("../../botconfig/emojis.json")
var config = require("../../botconfig/config.json")
var { format } = require("../functions")
  
//function for playling song

async function song(client, message, args, type) {
    var search = args.join(" ");
    
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
        if(!player.voiceChannel || player.voiceChannel === null || player.voiceChannel === undefined) {
            player.voiceChannel = message.member.voice.channel.id
        }
        player.connect();
    }
    try {
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
    } catch (e) {
        console.log(String(e.stack).red)
        const oopp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There was an error while searching`)
        return message.channel.send({embeds: [oopp]});  
    }
    if (!res.tracks[0]) {
        const yoyo = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
        return message.channel.send({embeds: [yoyo]})
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
        //set the variables
        //connect
        if(!player.voiceChannel || player.voiceChannel === null || player.voiceChannel === undefined) {
            player.voiceChannel = message.member.voice.channel.id
        }
        player.connect();
        //add track
        player.queue.add(res.tracks[0]);
        //play track
        if(message.member.voice.channel.type === "stage") {
            await message.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
        }
        player.play();
        player.pause(false);
    }
    else if(!player.queue || !player.queue.current){
        //add track
        player.queue.add(res.tracks[0]);
        //play track
        player.play();
        player.pause(false);
        if(message.member.voice.channel.type === "stage") {
            await message.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
        }
    }
    else {
        //add the latest track
        player.queue.add(res.tracks[0]);
        //send track information
        var playembed = new MessageEmbed()
        .setAuthor("ADDED TO QUEUE")
        .setDescription(`${emoji.msg.SUCCESS} [\`${res.tracks[0].title}\`](${res.tracks[0].uri})\n\nAdded By: ${res.tracks[0].requester.toString()} | Duration: \`❯ ${res.tracks[0].isStream ? `LIVE STREAM` : format(res.tracks[0].duration)}\` | Position In Queue: ${player.queue.length}`)
        .setColor(ee.color)  
        await message.channel.send({embeds: [playembed]})
        return;
    }
}
module.exports = song;