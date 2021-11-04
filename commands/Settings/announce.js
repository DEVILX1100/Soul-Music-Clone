const {
    MessageEmbed
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  const ee = require("../../botconfig/embed.json");
  const emoji = require("../../botconfig/emojis.json");
  module.exports = {
    name: "announce",
    aliases: ["toggleannounce", "announce"],
    category: "Settings",
    description: "Toggles pruning. If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
    usage: "togglepruning",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, guildData, player, prefix) => {
      try {
        //set the new prefix
        guildData.announce = !guildData.announce
        guildData.save()
        //return success embed
        const tt = new MessageEmbed()
        .setColor("#303037")
        .setDescription(`${guildData.announce ? emoji.msg.SUCCESS : emoji.msg.ERROR} Announcing of tracks is now **${guildData.announce ? `Enabled` : `Disabled`}**`)
        return message.channel.send({embeds: [tt]});
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