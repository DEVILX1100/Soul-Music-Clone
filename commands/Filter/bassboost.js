const {
  MessageEmbed
} = require(`discord.js`);

const DBL = require('@top-gg/sdk');
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `bassboost`,
  category: `Filter`,
  aliases: [`bb`],
  description: `Changes the Bass gain`,
  usage: `bassboost <none/low/medium/high>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {

      let level = `none`;
      if (!args.length || (!client.bassboost[args[0].toLowerCase()] && args[0].toLowerCase() != `none`)) {
        const difd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Bass boost level must be one of the following: \`none\`, \`low\`, \`medium\`, \`high\`, \`earrape\`\n\nUsage: \`${prefix}bassboost <Level>\`\n\nExample: \`${prefix}bassboost low\``)
        return message.channel.send({embeds: [difd]})
      }
      level = args[0].toLowerCase();
      switch (level) {
        case `none`:
          player.setEQ(client.bassboost.none);
          player.node.send({
            op: "filters",
            guildId: message.guild.id,
            equalizer: player.bands.map((gain, index) => {
                var Obj = {
                  "band": 0,
                  "gain": 0,
                };
                Obj.band = Number(index);
                Obj.gain = Number(gain)
                return Obj;
              }),
            timescale: {
                  "speed": 1.0,
                  "pitch": 1.0,
                  "rate": 1.0
              },
          });
          break;
        case `low`:
          player.setEQ(client.bassboost.low);
          player.node.send({
            op: "filters",
            guildId: message.guild.id,
            equalizer: player.bands.map((gain, index) => {
                var Obj = {
                  "band": 0,
                  "gain": 0,
                };
                Obj.band = Number(index);
                Obj.gain = Number(gain)
                return Obj;
              }),
          });
          break;
        case `medium`:
          player.setEQ(client.bassboost.medium);
          player.node.send({
            op: "filters",
            guildId: message.guild.id,
            equalizer: player.bands.map((gain, index) => {
                var Obj = {
                  "band": 0,
                  "gain": 0,
                };
                Obj.band = Number(index);
                Obj.gain = Number(gain)
                return Obj;
              }),
          });
          break;
        case `high`:
          player.setEQ(client.bassboost.high);
          player.node.send({
            op: "filters",
            guildId: message.guild.id,
            equalizer: player.bands.map((gain, index) => {
                var Obj = {
                  "band": 0,
                  "gain": 0,
                };
                Obj.band = Number(index);
                Obj.gain = Number(gain)
                return Obj;
              }),
          });
        case `earrape`:
          player.setEQ(client.bassboost.high);
          player.node.send({
            op: "filters",
            guildId: message.guild.id,
            equalizer: player.bands.map((gain, index) => {
                var Obj = {
                  "band": 0,
                  "gain": 0,
                };
                Obj.band = Number(index);
                Obj.gain = Number(gain)
                return Obj;
              }),
          });
          break;
      }
      const idde = new MessageEmbed()
      .setColor("#2F3136")
      .setDescription(`${emoji.msg.SUCCESS} Bassboost set the to \`${level}\`[**It might take up to 5 seconds until you hear the new Equalizer**]`)
      return message.channel.send({embeds: [idde]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]})
    }
  }
};