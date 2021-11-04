const Discord = require(`discord.js`);
const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);

const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
    name: `play`,
    category: `Music`,
    aliases: [`p`],
    description: `Plays a song from youtube`,
    usage: `play <Song / URL>`,
    parameters: {"type":"music", "activeplayer": false, "previoussong": false},
    run: async (client, message, args, guildData, player, prefix) => {
        try{
        
            try {
                if(/(open.spotify.com\/(track|playlist)\/+)/i.test(message.content)) {
                }
            } catch {/** */}

            //if no args return error
            if (!args[0]) {
                const ppp = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} You need to give me a URL or a Search term.`)
                return message.channel.send({embeds: [ppp]});
            }
  
            //play the SONG from YOUTUBE
            playermanager(client, message, args, `song:youtube`);
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
