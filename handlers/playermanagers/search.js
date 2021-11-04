var { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json");
var emoji = require("../../botconfig/emojis.json");
var { format } = require("../functions")

//function for searching songs
async function search(client, message, args, type) {
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
            if(message.member.voice.channel.type === "stage") {
                try {
                setTimeout(async () => {
                    await message.guild.me.voice.setSuppressed(false)
                }, 3000);
                } catch {/* */}
            }
        }
    try {
        // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
        res = await client.manager.search({
            query: search,
            source: type.split(":")[1]
        }, message.author);
        // Check the load type as this command is not that advanced for basics
        if (res.loadType === "LOAD_FAILED") throw res.exception;
        else if (res.loadType === "PLAYLIST_LOADED") {
            require("../../handlers/playermanagers/playlist")(client, message, args, type);
        }
    } catch (e) {
      console.log(String(e.stack).red)
      const errrr = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} There was an error while searching`)
      return message.channel.send({embeds: [errrr]});
    }


    var max = 10,
    collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
    if (res.tracks.length < max) max = res.tracks.length;
    track = res.tracks[0]

    var results = res.tracks
    .slice(0, max)
    .map((track, index) => `**${++index})** [\`${String(track.title).substr(0, 60).split("[").join("{").split("]").join("}")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
    .join('\n\n');

    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('searchlol')
        .setPlaceholder('❯ PLEASE SELECT A SONG FROM THE MENU!')
        .addOptions([
            {
                label: res.tracks[0].title,
                description: res.tracks[0].author,
                value: '1',
            },
            {
                label: res.tracks[1].title,
                description: res.tracks[1].author,
                value: '2',
            },
            {
                label: res.tracks[2].title,
                description: res.tracks[2].author,
                value: '3',
            },
            {
                label: res.tracks[3].title,
                description: res.tracks[3].author,
                value: '4',
            },
            {
                label: res.tracks[4].title,
                description: res.tracks[4].author,
                value: '5',
            },
            {
                label: res.tracks[5].title,
                description: res.tracks[5].author,
                value: '6',
            },
            {
                label: res.tracks[6].title,
                description: res.tracks[6].author,
                value: '7',
            },
            {
                label: res.tracks[7].title,
                description: res.tracks[7].author,
                value: '8',
            },
            {
                label: res.tracks[8].title,
                description: res.tracks[8].author,
                value: '9',
            },
            {
                label: res.tracks[9].title,
                description: res.tracks[9].author,
                value: '10',
            },
        ]),
    );

    const ssss = new MessageEmbed()
    .setColor(ee.color)
    .setDescription(results)
    message.channel.send({ embeds: [ssss], components: [row] }).then(selectMessage => {
        try {
            collector = selectMessage.createMessageComponentCollector(filter, {
                max: 1,
                time: 30e3,
                errors: ['time']
            });

            collector.on('collect', async i => {
                if (i.customId === 'searchlol') {
                    i.deferUpdate().catch(() => {
                        return
                    })

                    if (i.user.id !== message.author.id) {
                        const notyourslolfatty = new MessageEmbed()
                        .setTitle(`Error`)
                        .setColor(ee.color)
                        .setDescription(`**Hello ${i.user.username} This is not your selection**`) // Keep it simple developers
                        i.followUp({ embeds: [notyourslolfatty], ephemeral: true })
                        return
                    }
                    
                    const funny = i.values;
                    const something = funny[0]
                    
                    var index = Number(something) - 1;
                    track = res.tracks[index];
                    if (!res.tracks[0]) {
                        const fff = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
                        return message.channel.send({ embeds: [fff] })
                    }
                    if (player.state !== "CONNECTED") {
                        //set the variables
                        player.connect();
                        //add track
                        player.queue.add(track);
                        //set the variables
                        if(message.member.voice.channel.type === "stage") {
                            try { await message.guild.me.voice.setSuppressed(false) } catch {/** */}
                        }
                        //play track
                        player.play();
                        player.pause(false);

                        setTimeout(() => {
                            selectMessage.delete()
                        }, 4000);

                        collector.stop()
                    }
                    else if(!player.queue || !player.queue.current){
                        //add track
                        player.queue.add(track);
                        if(message.member.voice.channel.type === "stage") {
                            try { await message.guild.me.voice.setSuppressed(false) } catch {/** */}
                        }
                        //play track
                        player.play();
                        player.pause(false);

                        setTimeout(() => {
                            selectMessage.delete()
                        }, 4000);

                        collector.stop()
                    }
                    else {
                        player.queue.add(track);

                        var embed3 = new MessageEmbed()
                       .setAuthor(`${message.author.tag} - Track Queued`, message.author.displayAvatarURL())  
          
        .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
                        await selectMessage.edit({ embeds: [embed3], components: [ ] })
                        
                        setTimeout(() => {
                            selectMessage.delete()
                        }, 9000);

                        collector.stop()
                        return;
                    }
                }
            })
        } catch (e) {
            if (!player.queue.current) player.destroy();
            const op = new MessageEmbed()
            .setDescription(`${emoji.msg.ERROR} There was some error or something`)
            .setColor(ee.wrongcolor)
            return message.channel.send({ embeds: [op] });
        }
    })

    } catch (e) {}
}

module.exports = search;
