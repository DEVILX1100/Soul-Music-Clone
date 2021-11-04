const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const emoji = require(`../../botconfig/emojis.json`);
const ee = require("../../botconfig/embed.json");
const { autoplay } = require("../../handlers/functions");
module.exports = {
    name: "voteskip",
    category: "Music",
    aliases: ["vs"],
    parameters: {"type":"music", "activeplayer": true, "previoussong": false},
    description: "Lets you vote for skipping by reacting on message the current track.",
    usage: "voteskip",
    run: async (client, message, args, guildData, player, prefix) => {
        try{
   
            const { channel } = message.member.voice;
            //if the member is not in a channel, return
            if (!channel) {
              const opop = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
              return message.channel.send({embeds: [opop]})
            }
            //get the player instance
            const player = client.manager.players.get(message.guild.id);
            //if no player available return error | aka not playing anything
            if (!player){
                const opoppp = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} No song is currently playing in this guild.`)
                return message.channel.send({embeds: [opoppp]});
            }
            
            //if not in the same channel as the player, return Error
            if (channel.id !== player.voiceChannel) {
                const noi = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\n\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
                return message.channel.send({embeds: [noi]})
            }
            if (!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                return message.channel.send({embeds: [no]})
            }
      
            const voice = message.member.voice.channel;
            const members = voice.members.filter((m) => !m.user.bot);
      
            const embed = new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`React with 👍 to skip the track`)
      
            const m = await message.channel.send({embeds: [embed]});
        
            if(members.size > 1){
                    
                m.react("👍");
        
                const mustVote = Math.floor(members.size/2+1);
        
                embed.setDescription(`There are now \`${0}\`/\`${mustVote}\` votes! (You have 30 seconds)`)
                m.edit({embeds: [embed]});
            
        
                try {
                    const filter = (reaction, user) => {
                        const member = message.guild.members.cache.get(user.id);
                        const voiceChannel = member.voice.channel;
                        if(voiceChannel){
                            return voiceChannel.id === voice.id;
                        }
                    };
            
                    const collector = await m.createReactionCollector(filter, {
                        time: 30000
                    });
    
                    collector.on("collect", (reaction) => {
                        const haveVoted = reaction.count-1;
                        if(haveVoted >= mustVote){
                            if(player.queue.size == 0) {
                                if(player.get("autoplay")) {
                                    embed.setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`);
                                    m.edit({embeds: [embed]});
                                    autoplay(client, player, "skip");
                                    collector.stop(true);
                                    return;
                                } else {
                                    embed.setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`);
                                    m.edit({embeds: [embed]});
                                    player.stop();
                                }
                            }
                            player.stop();
                            embed.setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`);
                            m.edit({embeds: [embed]});
                            collector.stop(true);
                        } else {
                            embed.setDescription(`There are now \`${haveVoted}\`/\`${mustVote}\` votes!(You have 30 seconds)`)
                            m.edit({embeds: [embed]});
                        }
                    });

                    collector.on("end", (collected, isDone) => {
                        if(!isDone){
                            const iio = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} Time's Up! Send command again to skip the song!`)
                            return message.channel.send({embeds: [iio]});
                        }
                    });
    
                } catch {
                    const iio = new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} Time's Up! Send command again to skip the song!`)
                    return message.channel.send({embeds: [iio]});

                }
        
            } else {
                if(player.get("autoplay")) {
                    const idkd = new MessageEmbed()
                    .setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`)
                    .setColor(ee.color)
                    message.channel.send({embeds: [idkd]});
                    player.stop();
                    return autoplay(client, player);
                }
                player.stop()
                const idkd = new MessageEmbed()
                .setDescription(`${emoji.msg.skip_track} Skipped *${player.queue.current.title}*`)
                .setColor(ee.color)
                return message.channel.send({embeds: [idkd]});
            }
            return;

        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return message.channel.send({embeds: [emesdf]});
        }
    }
};