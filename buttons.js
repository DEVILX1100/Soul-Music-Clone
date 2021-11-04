.on("trackStart", async (message, player, track) => {
        try {
            player.set("previoustrack", track);
            //wait 500 ms
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2);
                }, 500);
            });

            const { MessageButton, MessageActionRow } = require("discord.js")

            let playrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("reducev")
                .setEmoji(emoji.msg.reduce_volume),
                new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("previous")
                .setEmoji(emoji.msg.previous_track),
                new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("pause-play")
                .setEmoji(emoji.msg.pause_resume),
                new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("skip")
                .setEmoji(emoji.msg.skip_track),
                new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("raisev")
                .setEmoji(emoji.msg.raise_volume)
            );
            
            // playANewTrack(client,player,track);
            var embed = new MessageEmbed()
            .setColor(ee.color)
            .setColor(ee.color)
            .setAuthor("NOW PLAYING")
            .setDescription(`${emoji.msg.playing} [\`${track.title}\`](${track.uri})\n\nRequested By: <@${track.requester.id}> | Duration: \`❯ ${track.isStream ? `LIVE STREAM` : format(track.duration)}\``);

          
            const guildData = await findOrCreateGuild(client, { id: player.guild });
            if(guildData.announce) {
                if (player.get(`playingsongmsg`) && msg.id !== player.get(`playingsongmsg`).id) {
                    return
                }

                await client.channels.cache.get(player.textChannel).send({ embeds: [embed], components: [playrow] }).then(msg => {
                    if(guildData.pruning) {
                       
                        if (player.get(`playingsongmsg`) && msg.id !== player.get(`playingsongmsg`).id) {
                            player.get(`playingsongmsg`).delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
                        }
                        player.set(`playingsongmsg`, msg)
                    }
                })
            }
        } catch {/* */}
    })