const {
  MessageEmbed
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
const config = require("../../botconfig/config.json")
module.exports = {
  name: "togglepruning",
  aliases: ["toggleprunning", "pruning", "prunning"],
  category: "Settings",
  description: "Toggles pruning. If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
  usage: "togglepruning",
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, guildData, player, prefix) => {
    try {

      const noprem = new MessageEmbed()
.setColor("#303037")
.setTitle(`${emoji.msg.prem} | Premium Only Command`)
.setDescription(`This Is A Premium Only Command Dm Owner To Buy [ \[ Free For Now \] ](${config.links.server})`)
.setFooter(ee.footertext, ee.footericon)

const premiumGuildSchema = require("../../models/premium-guild")

              premiumGuildSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
    if (!data) { 
    
        message.reply({embeds: [noprem]}) 
      
      } else {
          //set the new prefix
      guildData.pruning = !guildData.pruning
      guildData.save()

      //return success embed
      const opopo = new MessageEmbed()
      .setColor("#303037")
      .setDescription(`${guildData.pruning ? emoji.msg.SUCCESS : emoji.msg.ERROR} Pruning **${guildData.pruning ? `Enabled` : `Disabled`}**`)
      return message.channel.send({embeds: [opopo]});
      }
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