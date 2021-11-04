const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `cmdreload`,
  category: `Owner`,
  aliases: [`reload`],
  description: `Reloads a command`,
  usage: `cmdreload <CMD>`,
  run: async (client, message, args, guildData, player, prefix) => {
    if (!config.ownerIDS.includes(message.author.id)) {
      const nop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} You are not allowed to run this command! Only KenichiPlayZ is allowed to run this command`)
      return message.channel.send({embeds: [nop]})
    }
    try {
      let reload = false;
      for (let i = 0; i < client.categories.length; i += 1) {
        let dir = client.categories[i];
        try {
          if (!args[0]) {
            const opp = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Please include an argument`)
            return message.channel.send({embeds: [opp]})
          }
          delete require.cache[require.resolve(`../../commands/${dir}/${args[0]}.js`)] // usage !reload <name>
          client.commands.delete(args[0])
          const pull = require(`../../commands/${dir}/${args[0]}.js`)
          client.commands.set(args[0], pull)
          reload = true;
        } catch {}
      }
      if (reload) {
        const op = new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`${emoji.msg.SUCCESS} Reloaded \`${args[0]}\``)
        return message.channel.send({embeds: [op]})
      }
      const notop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Could not reload: \`${args[0]}\``)
      return message.channel.send({embeds: [notop]});
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