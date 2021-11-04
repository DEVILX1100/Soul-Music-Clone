const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const fs = require(`fs`);
module.exports = {
  name: `status`,
  category: `Owner`,
  aliases: [`setstatus`],
  cooldown: 15,
  description: `Changes the Bot Status`,
  usage: `status <Type> <TEXT>`,
  run: async (client, message, args, guildData, player, prefix) => {
    if (!config.ownerIDS.includes(message.author.id)) {
      const nop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} You are not allowed to run this command! Only KenichiPlayZ is allowed to run this command`)
      return message.channel.send({embeds: [nop]})
    }
    try {
      if (!args[0]) {
        const nn = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`Try this: \`${prefix}\`status <Type> <TEXT>`)
        return message.channel.send({embeds: [nn]})
      }
      if (!args[1]) {
        const dfdd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`Try this: \`${prefix}\`status <Type> <TEXT>`)
        return message.channel.send({embeds: [dfdd]})
      }

      let status = config
      status.status.text = args.slice(1).join(` `).substr(0, 50);
      status.status.type = args[0].toUpperCase();
      client.user.setActivity(args.slice(1).join(` `).substr(0, 50), {
        type: args[0].toUpperCase(),
        url: config.status.url
      })
      fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
        if (e) {
          console.log(String(e.stack).red);
          const nope = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setAuthor(`${emoji.msg.ERROR} Something Went Wrong...`)
          .setDescription(`\`\`\`${e.message}\`\`\``)
          return message.channel.send({embeds: [nope]})
        }
        const opop = new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`${emoji.msg.SUCCESS} Successfully set the new Status`)
        return message.channel.send({embeds: [opop]})
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]});
    }
  },
};