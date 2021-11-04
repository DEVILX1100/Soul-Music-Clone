const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
const Enmap = require("enmap");

module.exports = {
    name: "setup",
    category: "Settings",
    aliases: ["musicsetup"],
    cooldown: 10,
    usage: "setup",
    description: "Creates an unique Music Setup for Requesting Songs!",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix) => {
    try {
        let musiccmds = [];
        const commands = (category) => {
            return client.commands.filter((cmd) => cmd.category.toLowerCase().includes("music")).map((cmd) => `\`${cmd.name}\``);
        };
        for (let i = 0; i < client.categories.length; i += 1) {
            if (client.categories[i].toLowerCase().includes("music")) {
            musiccmds = commands(client.categories[i]);
            }
        }
        //get the old setup
        let oldsetup = client.setups.get(message.guild.id);
        //try to delete every single entry if there is a setup
        if (oldsetup.textchannel != "0") {
            try {
            message.guild.channels.cache.get(oldsetup.textchannel).delete().catch(e => console.log("Couldn't delete msg, this is for preventing a bug".gray));
            } catch {}
            try {
            message.guild.channels.cache.get(oldsetup.voicechannel).delete().catch(e => console.log("Couldn't delete msg, this is for preventing a bug".gray));
            } catch {}
            try {
            message.guild.channels.cache.get(oldsetup.category).delete().catch(e => console.log("Couldn't delete msg, this is for preventing a bug".gray));
            } catch {}
        }

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
        )
        
        //create a new Cateogry
        message.guild.channels.create("Astroz Music", {
            type: 'GUILD_CATEGORY',
            permissionOverwrites: [{
                id: message.guild.id,
                allow: ['VIEW_CHANNEL'],
            }, ],
        }).then((channel1) => {
          try {
            let maxbitrate = 96000;
            // hi whatt are you doing
            message.guild.channels.create(`Astroz Music`, {
                type: 'GUILD_VOICE',
                bitrate: maxbitrate, 
                userLimit: 10, 
                parent: channel1.id, //ADMINISTRATOR
                permissionOverwrites: [{
                    id: message.guild.id,
                    allow: ['VIEW_CHANNEL', "CONNECT"],
                }, ],
            })
            .then((channel2) => {
                    try {
                        message.guild.channels.create(`requests`, {
                        type: 'text', // text channel
                        rateLimitPerUser: 5, //set chat delay
                        topic: `
To request a Track, simply Type the **SONG NAME** into the Channel or the **URL** and the Bot will play it! Make sure that you are in the **right** Voice Channel (astroz-music)!
                        `,
                        parent: channel1.id,
                        permissionOverwrites: [{
                            id: message.guild.id,
                            allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ADD_REACTIONS"],
                        },
                        { 
                          id: client.user.id,
                          allow: ["MANAGE_MESSAGES", "MANAGE_CHANNELS", "ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_ROLES"]
                        }
                      ],
                    }).then(async (channel3) => {
                        message.reply(`Setting up in <#${channel3.id}>`)
                        let embed2 = new MessageEmbed()
                        .setTitle('No song currently playing')
                        .setDescription(`[Invite](${config.links.opbotinv}) • [Support server](${config.links.server})`)
                        .setColor(ee.color)
                        .setImage(ee.nosongbanner);

                        //send a temp message
                        const funnysettingsup = new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription("Setting Up..");

                        channel3.send({ embeds: [funnysettingsup] }).then(msg => {
                            //save it in the database
                            client.setups.set(message.guild.id, msg.id, "message_cmd_info");
                            //edit the message again
                            msg.edit({ embeds: [embed2], components: [playrow] })
                            //save it in the database
                            client.setups.set(message.guild.id, msg, "message_queue_info" );
                            client.setups.set(message.guild.id, msg.id, "message_info");
                            client.setups.set(message.guild.id, channel3.id, "textchannel");
                            client.setups.set(message.guild.id, channel2.id, "voicechannel");
                            client.setups.set(message.guild.id, channel1.id, "category");
                            client.stats.inc("global", "setups");
                        })
                      })
                    } catch (e) {
                        //log them
                        console.log(String(e.stack).red)
                        //send information
                        return message.channel.send(new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle(`${emoji.msg.ERROR} Error | Something went Wrong`)
                            .setDescription(String("```" + e.stack + "```").substr(0, 2048))
                        );
                    }
                })
            } catch (e) {
                //log them
                console.log(String(e.stack).red)
                //send information
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`${emoji.msg.ERROR} Error | Something went Wrong`)
                    .setDescription(String("```" + e.stack + "```").substr(0, 2048))
                );
            }
        })
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${emoji.msg.ERROR} Error | Something went Wrong`)
            .setDescription(`\`\`\`${e.message}\`\`\``)
        );
    }
  },
};