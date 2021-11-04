const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
  
module.exports = {
	name: `servers-list`,
	category: `Owner`,
	aliases: [`slist`],
	description: `Shows servers list`,
	usage: `servers-list`,
	run: async (client, message, args, guildData, player, prefix) => {
	  
		if (!config.ownerIDS.includes(message.author.id)) {
			const nop = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setDescription(`${emoji.msg.ERROR} You are not allowed to run this command! Only KenichiPlayZ is allowed to run this command`)
			return message.channel.send({embeds: [nop]})
		}
		 
		try {

			let servers = []
			client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r).forEach(element => {
				servers.push(element)
			});

			let serverslist = [];
			for (let i = 0; i < servers.length; i += 15) {
			  let xservers = servers.slice(i, i + 15);
			  serverslist.push(xservers.map((r, index) => `**${i + ++index}** - ${r.name} | ${r.memberCount} Members\nID: ${r.id}`).join(`\n`))
			}
			let limit = Math.round(servers.length / 15)
			let embeds = []
			for (let i = 0; i < limit; i++) {
			  let desc = String(serverslist[i]).substr(0, 2048)
			  await embeds.push(new MessageEmbed()
				.setFooter(ee.footertext, ee.footericon)
				.setColor("#2F3136")
				.setDescription(desc));
			}	  
	        return paginationxd(client, message, embeds, 60)

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

  async function paginationxd(client, message, embeds) {
      let currentPage = 0;
      const { MessageButton, MessageActionRow } = require("discord.js");
     
      
     
    
    
      let buttonrow1 = new MessageActionRow()
      .addComponents(
         new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('⏪')
      .setCustomId('first'),
     new MessageButton()
      .setStyle('SECONDARY')
      .setLabel('⬅️')
      .setCustomId('back'),
      new MessageButton()
      .setStyle('SUCCESS')
      .setLabel('❌')
      .setCustomId('home'),
    
      new MessageButton()
      .setStyle('SECONDARY')
      .setLabel('➡️')
      .setCustomId('next'),
      new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('⏩')
      .setCustomId('last')
          );
          
    
      
    
    
      if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
      const queueEmbed = await message.channel.send(
        {
          content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
          components: [buttonrow1],
          embeds: [embeds[currentPage]]
        }
      );
    
      
    
      const collector = message.channel.createMessageComponentCollector({ 
                            filter: interaction => (interaction.isButton() || interaction.isSelectMenu()) && interaction.message.author.id == client.user.id,
                        })
    
      collector.on("collect", (interaction) => {
    
        
    
          
    
        if(interaction.customId == "next"){
          if (currentPage < embeds.length - 1) {
            interaction.reply({content: `Success`, ephemeral: true})
                  currentPage++;
                  queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
                } else {
                  interaction.reply({content: `Success`, ephemeral: true})
                  currentPage = 0
                  queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
                }
        } else if(interaction.customId == "back"){
          interaction.reply({content: `Success`, ephemeral: true})
        
          if (currentPage !== 0) {
                  --currentPage; to
                  queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
                } else {
                  currentPage = embeds.length - 1
                  queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
                }
    } else if(interaction.customId == "first"){
      interaction.reply({content: `Success`, ephemeral: true})
    
      currentPage = 0;
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            
    } else if(interaction.customId == "last"){
      interaction.reply({content: `Success`, ephemeral: true})
    
      currentPage = embeds.length - 1;
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            
    } else if(interaction.customId == "home"){
    
      
    }
    
    
        })
                            
                        
        
    }