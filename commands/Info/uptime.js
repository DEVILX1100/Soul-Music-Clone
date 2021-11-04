const moment = require('moment');
const ee = require("../../botconfig/embed.json");
module.exports = {
  name: "uptime",
  category: "Info",
  aliases: ["u"],
  cooldown: 10,
  usage: "uptime",
  description: "Returns the duration on how long the Bot is online",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      const d = moment.duration(client.uptime);
      const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
      const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
      const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
      const seconds = (d.seconds() == 1) ? `${d.seconds()} second` : `${d.seconds()} seconds`;
      const up = `\`\`\`nim\nUptime  :: ${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``
      message.reply(up);
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
}
