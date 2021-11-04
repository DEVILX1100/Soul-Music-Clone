const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `leaveguild`,
  category: `Owner`,
  aliases: [`leaveg`, `gleave`],
  description: `Leaves A Guild`,
  usage: `leaveguild <guild id>`,
  run: async (client, message, args, guildData, player, prefix) => {
    if (!config.ownerIDS.includes(message.author.id)) {
      const nop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} You are not allowed to run this command! Only KenichiPlayZ is allowed to run this command`)
      return message.channel.send({embeds: [nop]})
    }
    try {
      const gleave = args[0];
 
      if (!gleave) {
        return message.channel.send({content: "Please provide an id"});
      }
         
      const guild = client.guilds.cache.find((g) => g.id === gleave);
         
      if (!guild) {
        return message.channel.send({content: "That guild wasn't found"});
      }
         
      try {
        await guild.leave();
        message.channel.send({content: `I have left the Guild: **${guild.name}**`});
      } catch (error) {
        console.error(error);
        return message.channel.send({content: "I Couldent leave the Guild!"});
      } 
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