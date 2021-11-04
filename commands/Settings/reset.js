const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `reset`,
  aliases: [`hardreset`],
  perms: [ `SEND_MESSAGES` ],
  botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
  category: `Settings`,
  description: `Resets / Deletes all of the Setups as well as the prefix!`,
  usage: `reset`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //ask for second yes
      const gggg = new MessageEmbed()
      .setColor("#303037")
      .setDescription(`${emoji.msg.warn} **Do you really want to reset all Settings**?\n*Reply with:* **__\`yes\`__**`)
      let themsg = message.channel.send({embeds: [gggg]}).then((msg) => {
        //wait for answer of the right user
        msg.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30 * 1000,
            errors: ['time']
          })
          //after right user answered
          .then(async collected => {
            //and if its yes
            if (collected.first().content.toLowerCase() === `yes`) {
        
              //reset the settings like prefix djroles and botchannels
              guildData.prefix = config.prefix;
              guildData.voiceChannel = null;
              guildData.textChannel = null;
              guildData.ajenabled = false;
              guildData.announce = true;
              guildData.song = null;
              guildData.pruning = true;
              guildData.djonlycmds = [ ];
              guildData.botChannels = [ ];
              guildData.djRoles = [ ];
              guildData.djonlycmds = ["autoplay", "clearqueue", "forward", "loop", "pause", "resume", "remove", "replay", "rewind", "seek", "shuffle", "skip", "stop", "volume"];

              guildData.save();
              //send the success message
              const rrr = new MessageEmbed()
              .setColor("#303037")
              .setDescription(`${emoji.msg.SUCCESS} Resetted everything!`)
              return message.channel.send({embeds: [rrr]});
            }
            //if an error happens, reply
          }).catch(e => {
            console.log(String(e.stack).yellow)
            const fff = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Time's up! send the command again to reset all settings!`)
            return message.channel.send({embeds: [fff]});
          })
      });
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

