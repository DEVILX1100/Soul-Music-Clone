const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const emoji = require("../botconfig/emojis.json");
const ee = require("../botconfig/embed.json");

module.exports.getMember = getMember 
module.exports.shuffle = shuffle;
module.exports.formatDate = formatDate;
module.exports.duration = duration;
module.exports.promptMessage = promptMessage;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomNum = getRandomNum;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.escapeRegex = escapeRegex;
module.exports.autoplay = autoplay;
module.exports.arrayMove = arrayMove;
module.exports.swap_pages2 = swap_pages2;
module.exports.swap_pages1 = swap_pages1;
module.exports.findOrCreateGuild = findOrCreateGuild;
// This function is used to find a guild data or create it
async function findOrCreateGuild(client, { id: guildID }, isLean){
  if(client.databaseCache.guilds.get(guildID)){
    return isLean ? client.databaseCache.guilds.get(guildID).toJSON() : client.databaseCache.guilds.get(guildID);
  } else {
    let guildData = (isLean ? await client.guildsData.findOne({ id: guildID }) : await client.guildsData.findOne({ id: guildID }));
    if(guildData){
      if(!isLean) client.databaseCache.guilds.set(guildID, guildData);
      return guildData;
    } else {
      guildData = new client.guildsData({ id: guildID });
      await guildData.save();
      client.databaseCache.guilds.set(guildID, guildData);
      return isLean ? guildData.toJSON() : guildData;
    }
  }
}


function getMember(message, toFind = "") {
  try {
    toFind = toFind.toLowerCase();
    let target = message.guild.members.get(toFind);
    if (!target && message.mentions.members) target = message.mentions.members.first();
    if (!target && toFind) {
      target = message.guild.members.find((member) => {
        return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
      });
    }
    if (!target) target = message.member;
    return target;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US").format(date);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function duration(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString();
  const min = Math.floor((ms / (60 * 1000)) % 60).toString();
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
  const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
  return `${days}Days,${hrs}Hours,${min}Minutes,${sec}Seconds`;
}



function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

//randomnumber between 0 and x
function getRandomInt(max) {
  try {
    return Math.floor(Math.random() * Math.floor(max));
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}
//random number between y and x
function getRandomNum(min, max) {
  try {
    return Math.floor(Math.random() * Math.floor((max - min) + min));
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}
function createBar(player) {
  try{
    let size = 15;
    if (!player.queue.current) return `**${emoji.msg.progress_bar.emptybeginning}${emoji.msg.progress_bar.filledframe}${emoji.msg.progress_bar.emptyframe.repeat(size - 1)}${emoji.msg.progress_bar.emptyend}**\n**00:00:00 / 00:00:00**`;
    let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
    let total = player.queue.current.duration;
    let rightside = size - Math.round(size * (current / total));
    let leftside = Math.round(size * (current / total));
    let bar;
    if (leftside < 1) bar = String(emoji.msg.progress_bar.emptybeginning) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(emoji.msg.progress_bar.emptyend);
    else bar = String(emoji.msg.progress_bar.leftindicator) + String(emoji.msg.progress_bar.filledframe).repeat(leftside) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(size - rightside !== 1 ? emoji.msg.progress_bar.emptyend : emoji.msg.progress_bar.rightindicator);
    return `**${bar}**\n**${!player.queue.current.isStream ? `**${new Date(player.position).toISOString().substr(11, 8)} / ${new Date(player.queue.current.duration).toISOString().slice(11, 19)}**` : '`◉ LIVE`'}**`;
  }catch (e){
    console.log(String(e.stack).bgRed)
  }
}
function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

async function promptMessage(message, author, time, validReactions) {
  try {
    time *= 1000;
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
    return message.awaitReactions(filter, {
      max: 1,
      time: time
    }).then((collected) => collected.first() && collected.first().emoji.name);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

async function autoplay (client, player, type) {
  try {
    if (player.queue.size > 0) return;
    let previoustrack = player.get("previoustrack");
    if (!previoustrack) return;

    const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
    const res = await client.manager.search(mixURL, previoustrack.requester);
    //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
    if (!res || res.loadType === 'LOAD_FAILED' || res.loadType !== 'PLAYLIST_LOADED') {
      let embed = new MessageEmbed()
      .setDescription(`${emoji.msg.ERROR} Found nothing related for the latest Song!`)
      .setColor(ee.wrongcolor)
      try {
        client.channels.cache.get(player.textChannel).send({embeds: [embed]})
      } catch (e) { console.log(e) }
    }
    player.queue.add(res.tracks[2]);
    if(type === "skip") {
      player.stop()
    } else {
      player.play()
    }
    return;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

async function isrequestchannel (client, channelid, guildid) {
    //get the setup channel from the database
    
    if (client.setups.get(guildid, "textchannel") !== "0") {
      try{
        //get the channel from the database channelid data
        let channel = await client.channels.fetch(String(client.setups.get(guildid, "textchannel"))).catch(e=>{return false;});
        //if the channel is undefined aka not existing reset the database
        if (!channel) {
          return false;
        }
        //if its in the request channel do this
        if (channel.id === channelid) {
          return true;
        } else {
          return false;
        }
      }catch {
        return false;
      }
    }
    else {
      return false;
    }
}

async function swap_pages2(client, message, embeds) {
    let currentPage = 0;
    const { MessageButton, MessageActionRow } = require("discord.js");
 
    let buttonrow1 = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('<:ARROW1:874262374595588117>')
        .setCustomId('skip-page1'),
        new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('<:ARROW2:874262374733987860>')
        .setCustomId('back-page'),
        new MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('<:HOME:894217044013248532>')
        .setCustomId('home-page'),
        new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('<:ARROW3:874262374541049896>')
        .setCustomId('next-page'),
        new MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('<:ARROW4:874262374608150578>')
        .setCustomId('skip-page2')
	);

    if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
    const queueEmbed = await message.channel.send(
        {
            content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
            components: [buttonrow1],
            embeds: [embeds[currentPage]]
        }
    ).then(msg => {
        const collector = msg.createMessageComponentCollector({ 
            filter: interaction => (interaction.isButton() || interaction.isSelectMenu()) && interaction.message.author.id == client.user.id,
        })
    })

    collector.on("collect", (interaction) => {
        if(interaction.customId == "next-page") {
            if (currentPage < embeds.length - 1) {
                currentPage++;
                queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            } else {
                currentPage = 0
                queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2]});
            }
        } else if(interaction.customId == "back-page") {
            if (currentPage !== 0) {
                --currentPage; to
                queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            } else {
                currentPage = embeds.length - 1
                queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            }
        } else if(interaction.customId == "skip-page1") {
            currentPage = 0;
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});          
        } else if(interaction.customId == "skip-page2") {
            currentPage = embeds.length - 1;
            queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        } else if(interaction.customId == "home-page"){
            interaction.message.delete()
        }
    })
}

async function swap_pages3(client, message, embeds) {
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

  


  if (embeds.length === 1) return interaction.reply({embeds: [embeds[0]]})
  const queueEmbed = await interaction.reply(
    {
      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      components: [buttonrow1],
      embeds: [embeds[currentPage]]
    }
  );

  

  const collector = interaction.message.channel.createMessageComponentCollector({ 
                        filter: interaction => (interaction.isButton() || interaction.isSelectMenu()) && interaction.message.author.id == client.user.id,
                    })

  collector.on("collect", (interaction) => {

    

      

if(interaction.customId == "next"){
    if (currentPage < embeds.length - 1) {
        currentPage++;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
    } else {
        currentPage = 0
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2]});
    }
} else if(interaction.customId == "back"){

  if (currentPage !== 0) {
          --currentPage; to
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        } else {
          currentPage = embeds.length - 1
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        }
} else if(interaction.customId == "first"){

  currentPage = 0;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        
} else if(interaction.customId == "last"){

  currentPage = embeds.length - 1;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1]});
        
} else if(interaction.customId == "home"){

  interaction.message.delete()
}


    })
                        
                    
    
}


async function swap_pages1(client, message, embeds, seconds) {
  let currentPage = 0;
  const { MessageButton, MessageActionRow } = require("discord-buttons");
  let button1 = new MessageButton()
  .setStyle('green')
  .setLabel('First')
  .setID('first');
  let button2 = new MessageButton()
  .setStyle('blurple')
  .setLabel('Back')
  .setID('back');
  let button3 = new MessageButton()
  .setStyle('gray')
  .setLabel('Cancel')
  .setID('home');
  let button4 = new MessageButton()
  .setStyle('blurple')
  .setLabel('Next')
  .setID('next');
  let button5 = new MessageButton()
  .setStyle('green')
  .setLabel('Last')
  .setID('last');

  let buttonrow = new MessageActionRow()
  .addComponent(button1)
  .addComponent(button2)
  .addComponent(button3)
  .addComponent(button4)
  .addComponent(button5)

  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
  const queueEmbed = await message.channel.send(
    {
      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      component: buttonrow,
      embeds: [embeds[currentPage]]
    }
  );

  const collector = queueEmbed.createButtonCollector((button)=> button.clicker.user.id === message.author.id, {time: seconds * 1000})

  collector.on("collect", async (b) => {
    try {
      b.defer();
      if (b.id == "next") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        } else {
          currentPage = 0
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        }
      } else if (b.id == "back") {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        } else {
          currentPage = embeds.length - 1
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        }
      } else if(b.id == "first") {
        currentPage = 0;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      } else if(b.id == "last") {
        currentPage = embeds.length - 1;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      }
      else {
        button1 = new MessageButton()
        .setStyle('green')
        .setDisabled()
        .setLabel('First')
        .setID('first');
        button2 = new MessageButton()
        .setStyle('blurple')
        .setDisabled()
        .setLabel('Back')
        .setID('back');
        button3 = new MessageButton()
        .setStyle('gray')
        .setDisabled()
        .setLabel('Cancel')
        .setID('home');
        button4 = new MessageButton()
        .setStyle('blurple')
        .setLabel('Next')
        .setDisabled()
        .setID('next');
        button5 = new MessageButton()
        .setStyle('green')
        .setLabel('Last')
        .setDisabled()
        .setID('last');
      
        buttonrow = new MessageActionRow()
        .addComponent(button1)
        .addComponent(button2)
        .addComponent(button3)
        .addComponent(button4)
        .addComponent(button5)
      
        currentPage = 0
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      }
    } catch {}
  });
}