const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `grab`,
  category: `Music`,
  aliases: [`save`, `yoink`],
  description: `Saves the current playing song to your Direct Messages`,
  usage: `grab`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    const emem  = new MessageEmbed()
    .setAuthor(`Saved Song:`, message.author.displayAvatarURL({
      dynamic: true
    }))
    .setURL(player.queue.current.uri)
    .setColor("#2F3136")
    .setFooter(ee.footertext, ee.footericon)
    .setTitle(`${player.playing ? `${emoji.msg.resume}` : `${emoji.msg.pause}`} **${player.queue.current.title}**`)
    .addField(`${emoji.msg.time} Duration: `, `\`${format(player.queue.current.duration)}\``, true)
    .addField(`${emoji.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
    .addField(`${emoji.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
    .addField(`${emoji.msg.playing} Play it:`, `\`${prefix}play ${player.queue.current.uri}\``)
    .addField(`${emoji.msg.search} Saved in:`, `<#${message.channel.id}>`)
    .setFooter(`Requested by: ${player.queue.current.requester.tag} | in: ${message.guild.name}`, player.queue.current.requester.displayAvatarURL({
      dynamic: true
    }))
    message.author.send({embeds: [emem]}).catch(e=>{
      const ememe = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`**${emoji.msg.ERROR} Your Dm's are disabled**`)
      return message.channel.send({embeds: [ememe]})
    })
    message.react(emoji.msg.SUCCESS).catch(e=>console.log("Could not react"))
  }
};