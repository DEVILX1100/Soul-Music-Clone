const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "toggledjonlycmd",
  aliases: ["adddjonly", "djonly", "setdjonly", "toggledjonly"],
  category: "Settings",
  description: "Set's a Command to the DJ ONLY State, by typing it again, it gets to not DJ ONLY aka its a toggle",
  usage: "toggledjonlycmd @role",
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //get the role of the mention
      let cmd = args[0]
      //if no pinged role return error
      if (!cmd) {
        const nn = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please add a cmd!\nExample: \`${prefix}toggledjonlycmd skip\``)
        return message.channel.send({embeds: [nn]})
      }

      let musiccmds = [];
      const commands = (category) => {
        return client.commands.filter((cmd) => cmd.category.toLowerCase().includes("music")).map((cmd) => `${cmd.name}`);
      };
      for (let i = 0; i < client.categories.length; i += 1) {
        if (client.categories[i].toLowerCase().includes("music")) {
          musiccmds = commands(client.categories[i]);
        }
      }
      if (musiccmds.join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())) {
        //if its in then its dj only so remove it
        if (guildData.djonlycmds.join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())) {
          try {
            guildData.djonlycmds = guildData.djonlycmds.pull(args[0])
            guildData.save();
            const idkdk = new MessageEmbed()
            .setColor("#303037")
            .setDescription(`${emoji.msg.SUCCESS} Set command \`${args[0]}\` to not DJ only\nAll DJ only commands:\n> \`\`\`${guildData.djonlycmds.sort(function(a, b){if(a < b) { return -1; }if(a > b) { return 1; }  return 0;}).join(", ")}\`\`\``)
            return message.channel.send({embeds: [idkdk]});
          } catch (e) {
            console.log(String(e.stack).red);
            const opop = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${emoji.msg.ERROR} An error occurred`)
            .setDescription("```" + e.stack + "```")
            return message.channel.send({embeds: [opop]});
          }
        } else {
          try {
            guildData.djonlycmds.push(args[0])
            guildData.save()
            const ospri = new MessageEmbed()
            .setColor("#303037")
            .setDescription(`${emoji.msg.SUCCESS} Set command \`${args[0]}\` to DJ only\nAll DJ only commands:\n> \`\`\`${guildData.djonlycmds.sort(function(a, b){if(a < b) { return -1; }if(a > b) { return 1; }  return 0;}).join(", ")}\`\`\``)
            return message.channel.send({embeds: [ospri]});
          } catch (e) {
            console.log(String(e.stack).red);
            const sso = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${emoji.msg.ERROR} An error occurred`)
            .setDescription("```" + e.stack + "```")
            return message.channel.send({embeds: [sso]});
          }
        }
      } else {
        const yyy = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Could not find Music Command \`${args[0]}\``)
        return message.channel.send({embeds: [yyy]});
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

