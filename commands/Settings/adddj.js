const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);

module.exports = {
  name: `adddj`,
  aliases: [`adddjrole`],
  category: `Settings`,
  description: `Let's you define a DJ ROLE (as an array, aka you can have multiple)`,
  usage: `adddj @role`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //get the role of the mention
      let role = message.mentions.roles.first();
      //if no pinged role return error
      if (!role) {
        const nor = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please add a Role via ping, @role!`)
        return message.channel.send({embeds: [nor]})
      }
      //try to find the role in the guild just incase he pings a role of a different server
      try {
        message.guild.roles.cache.get(role.id);
      } catch {
        const oeoe = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} It seems that the Role does not exist in this Server!`)
        return message.channel.send({embeds: [oeoe]});
      }
      //if ther role is already in the Database, return error
      if (guildData.djRoles.includes(role.id)) {
        const pdp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} This Role is alerady in the List!`)
        return message.channel.send({embeds: [pdp]});
      }
      if(guildData.djRoles.length > 5) {
        const fifi = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You can set only 5 dj roles!`)
        return message.channel.send({embeds: [fifi]})
      }
      //push it into the database
      guildData.djRoles.push(role.id);
			guildData.save();
      //these lines creates a string with all djroles
      const psos = new MessageEmbed()
      .setColor("#303037")
      .setDescription(`${emoji.msg.SUCCESS} Added the DJ ROLE \`${role.name}\`\n\n↪️ All Dj Roles:\n> ${guildData.djRoles.length > 0 ? guildData.djRoles.map((dj) => `<@&${dj}>`).join(" | ") : `No DJ Roles`}`)
      return message.channel.send({embeds: [psos]});
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

