const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
module.exports = {
  name: `equalizer`,
  perms: [ `SEND_MESSAGES` ],
  botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
  category: `Filter`,
  aliases: [`eq`, "eqs", "seteq", "setequalizer"],
  description: `Changes the Equalizer`,
  usage: `bassboost <music/bassboost/earrape>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {

    try {
      let level = `none`;
      if (!args.length || (!client.eqs[args[0].toLowerCase()] && args[0].toLowerCase() != `none`)) {
        const isd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.ERROR} Equalizer level must be one of the following`)
        .setDescription(`Valid Equalizers:\n\`music\`, \`pop\`, \`electronic\`, \`classical\`, \`rock\`, \`full\`, \`gaming\`, \`bassboost\`, \`earrape\`\n\nUsage: \`${prefix}equalizer <Level>\`\n\nExample: \`${prefix}equalizer music\``)
        return message.channel.send({embeds: [isd]})
      }
      level = args[0].toLowerCase();
      switch (level) {
        case `music`:
          player.setEQ(client.eqs.music);
          break;
        case `pop`:
          player.setEQ(client.eqs.pop);
          break;
        case `electronic`:
        case `electro`:
        case `techno`:
          player.setEQ(client.eqs.electronic);
          break;
        case `classical`:
        case `classic`:
        case `acustics`:
          player.setEQ(client.eqs.classical);
          break;
        case `rock`:
        case `metal`:
          player.setEQ(client.eqs.rock);
          break;
        case `full`:
        case `ful`:
          player.setEQ(client.eqs.full);
          break;
        case `gaming`:
        case `game`:
        case `gam`:
          player.setEQ(client.eqs.gaming);
          break;
        case `music`:
          player.setEQ(client.eqs.music);
          break;
        case `bassboost`:
          player.setEQ(client.eqs.bassboost);
          break;
        case `earrape`:
          player.setVolume(player.volume + 50);
          player.setEQ(client.eqs.earrape);
          break;
      }
      const emdn = new MessageEmbed()
      .setColor("#2F3136")
      .setDescription(`Note: **It might take up to 5 seconds until you hear the new Equalizer**`)
      return message.channel.send({embeds: [emdn]});
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
