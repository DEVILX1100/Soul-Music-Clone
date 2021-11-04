const {
    MessageEmbed
  } = require(`discord.js`);
  const config = require(`../../botconfig/config.json`);
  const ee = require(`../../botconfig/embed.json`);
  const emoji = require(`../../botconfig/emojis.json`);
  const {
    format,
    arrayMove
  } = require(`../../handlers/functions`);
  module.exports = {
    name: `movebot`,
    category: `Music`,
    aliases: [ ],
    description: `Moves you to the BOT, if playing something`,
    usage: `move`,
    memberpermissions: [`MOVE_MEMBERS`],
    parameters: {"type":"music", "activeplayer": true, "previoussong": false, "notsamechannel": true},
    run: async (client, message, args, guildData, player, prefix) => {
     
        try{
        
            const channel = message.member.voice.channel;
            if(channel.id === message.guild.me.voice.channel.id) {
                const ttt = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} I am already in your channel`)
                return message.channel.send({embeds: [ttt]})
            }

            const opop = new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${emoji.msg.SUCCESS} Joining your channel`)
            await message.channel.send({embeds: [opop]}).then(async msg => {
                const tne = new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`<a:loading2:847437560128077836> Trying to continue the player!`)
                msg.edit({embeds: [tne]}).then(async msg => {
                    await message.guild.me.voice.setChannel(message.member.voice.channel, "Resume queue in new channel");
                    if(channel.type === "stage") {
                        await message.guild.me.voice.setSuppressed(false)
                    }
                    player.voiceChannel = message.member.voice.channel.id;
                    const rrr = new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(`${emoji.msg.SUCCESS} Successfully continued queue!`)
                    msg.edit({embeds: [rrr]})
                })
            })
  
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