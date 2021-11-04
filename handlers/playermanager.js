
const {
  MessageEmbed
} = require("discord.js");
const Discord = require("discord.js")
const emoji = require("../botconfig/emojis.json")
const config = require("../botconfig/config.json")
const ee = require("../botconfig/embed.json")
module.exports = async (client, message, args, type) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!message.guild) return;
  //just visual for the console
  let {
    channel
  } = message.member.voice;
  const permissions = channel.permissionsFor(client.user);

  if (!permissions.has(Discord.Permissions.FLAGS.CONNECT)) {
    const ifk = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} I need permissions to join your channel`)
    return message.channel.send({embeds: [ifk]})
  }
  if (!permissions.has(Discord.Permissions.FLAGS.SPEAK)) {
    const tt = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} I need permissions to speak in your channel`)
    return message.channel.send({embeds: [tt]})
  }

  if (method[0] === "song")
    require("./playermanagers/song")(client, message, args, type); 
  else if (method[0] === "playlist")
    require("./playermanagers/playlist")(client, message, args, type);
  else if (method[0] === "similar")
    require("./playermanagers/similar")(client, message, args, type);
  else if (method[0] === "search")
    require("./playermanagers/search")(client, message, args, type);
  else if(method[0] === "playtop")
    require("./playermanagers/playtop")(client, message, args, type);
  else if (method[0] === "skiptrack")
  require("./playermanagers/skiptrack")(client, message, args, type); 
  else {
    const f = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} No valid search Term`)
    return message.channel.send({embeds: [f]});
  }
}