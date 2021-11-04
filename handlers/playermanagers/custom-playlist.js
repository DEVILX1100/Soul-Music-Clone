var config = require("../../botconfig/config.json")
const { TrackUtils } = require("erela.js")

async function customplaylist(client, message, songs) {

    var player = client.manager.players.get(message.guild.id);
    if(!player) {
        player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: config.settings.selfDeaf,
        });
    }

   try {
        for (const track of songs) {
            const unresolvedTrack = TrackUtils.buildUnresolved({
                title: track.title,
                author: track.author,
                duration: track.duration
            }, message.author);
            player.queue.add(unresolvedTrack);
        }
    } catch (e) {
        console.log(String(e.stack).red)
    }

    let state = player.state;
    if (state !== "CONNECTED") { 
        //set the variables
        player.connect();
        setTimeout(async () => {
            if(message.member.voice.channel.type === "stage") {
                try { await message.guild.me.voice.setSuppressed(false) } catch {/* */}
            }                
        }, client.ws.ping);
        player.play();
    } else if(!player.queue || !player.queue.current) {
        setTimeout(async () => {
            if(message.member.voice.channel.type === "stage") {
                try { await message.guild.me.voice.setSuppressed(false) } catch {/* */}
            }                
        }, client.ws.ping);
        player.play()
    }
}
module.exports = customplaylist;
  