const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `removedj`,
  aliases: [`deletedj`],
  category: `Settings`,
  description: `Let's you DELETE a DJ ROLE`,
  usage: `removedj @ROLE`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //get the role of the mention
      let role = message.mentions.roles.first();
      //if no pinged role return error
      if (!role) {
        const yop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please add a Role via ping, @role!`)
        return message.channel.send({embeds: [yop]})
      }
      //try to find the role in the guild just incase he pings a role of a different server
      try {
        message.guild.roles.cache.get(role.id);
      } catch {
        const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} It seems that the Role does not exist in this Server!`)
        return message.channel.send({embeds: [opop]});
      }
      //if its not in the database return error
      if (!guildData.djRoles.includes(role.id)) {
        const opo = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} This Role is not a DJ-ROLE!`)
        return message.channel.send({embeds: [opo]})
      }
      //remove it from the Database
      guildData.djRoles.pull(role.id)
      guildData.save()
      //send the success message
      const opoooo = new MessageEmbed()
      .setColor("#303037")
      .setDescription(`${emoji.msg.SUCCESS} Removed the DJ ROLE \`${role.name}\`\n\n↪️ All left Dj Roles:\n> ${guildData.djRoles.length > 0 ? guildData.djRoles.map((dj) => `<@&${dj}>`).join(", ") : `No DJ Roles`}`)
      return message.channel.send({embeds: [opoooo]});
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

