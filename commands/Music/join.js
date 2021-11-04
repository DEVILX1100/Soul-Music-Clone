const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `join`,
  category: `Music`,
  aliases: [`j`],
  description: `Joins the Bot in your Channel`,
  usage: `join`,
  parameters: {"type":"radio", "activeplayer": false, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      var { channel } = message.member.voice;
      if(!channel) {
        const tot = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You are not connected to a Voice Channel`)
        return message.channel.send({embeds: [tot]})
      }
      //if no args return error
      var player = client.manager.players.get(message.guild.id);
      if(player) {
        const mm = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} I am already connected somewhere`)
        return message.channel.send({embeds: [mm]});
      }
      //create the player
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
      //join the chanel
      if (player.state !== "CONNECTED") { 
        try {
          message.react(emoji.msg.SUCCESS)
        } catch {/* */}
        // join the channel
        player.connect();
        if(message.member.voice.channel.type === "stage") {
          setTimeout(async () => {
            try{ await message.guild.me.voice.setSuppressed(false) } catch {/* */}
          }, client.ws.ping);
        }
      }
      else {
        const oop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} I am already connected somewhere`)
        return message.channel.send({embeds: [oop]});
      }
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
