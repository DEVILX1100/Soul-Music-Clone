const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); //Loading all needed functions
const { MessageEmbed } = require(`discord.js`);

const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/892810763620741150/NPe1z6Hq0NnOagvK5V2ikB5MflPJhIc-T4s9Atj1DC8J6-oRT7iE-tJ12H9SQyctezoY' });
//here the event starts
module.exports = async (client, message) => {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!message.guild || !message.channel) return;
    //if the channel is on partial fetch it
    if (message.channel.partial) await message.channel.fetch();
    //if the message is on partial fetch it
    if (message.partial) await message.fetch();
    // if the message  author is a bot, return aka ignore the inputs
    if (message.author.bot) return;
    // Gets guild data
    const guildData = await findOrCreateGuild(client, { id: message.guild.id });
    //get the current prefix from the database
    let prefix = guildData.prefix;
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    let not_allowed = false;
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0){
        not_allowed = true;
        if(matchedPrefix.includes(client.user.id)){
            const fff = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}), config.links.opmusicinv)
            .setDescription(`**Prefix:** \`${prefix}\`\n**Developer:** \`Astroz Development\`\n**Servers: \`${client.guilds.cache.size}\`**\n\n**Support Server:** If You Need Help With To Astoz Music Join [**Support Server**](${config.links.server})\n**Invite:** Invite Me By Clicking **[Here](${config.links.opmusicinv})**\n`)
            .setColor(ee.color)
            return message.channel.send({embeds: [fff]});
        }
        return;
    }
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
        //CHECK IF IN A BOT CHANNEL OR NOT
        if(guildData.botChannels.toString() !== ""){
            if (!guildData.botChannels.includes(message.channel.id) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                let leftb = "";
                for(let i = 0; i < guildData.botChannels.length; i++){
                    leftb  +="<#" +guildData.botChannels[i] + "> / "
                }
                try{ message.react(emoji.msg.ERROR); }catch{}
                not_allowed = true;
                const idk = new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} Not in the Bot Chat!\n\nThere is a Bot chat setup in this Guild! try using the Bot Commands here:\n> ${leftb.substr(0, leftb.length - 3)}`)
                const x = await message.channel.send({embeds: [idk]})
                setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
                return;
            }
        }
    }
    //if the command is now valid
    if (command){
        if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
        if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")){
            const x = await message.channel.send({content: `${emoji.msg.ERROR} I don't have \`EMBED LINKS\` permssion`})
            setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
            return;
        }
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 2.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
        if (timestamps.has(message.author.id)) { //if the user is on cooldown
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
            if (now < expirationTime) { //if he is still on cooldonw
                const timeLeft = (expirationTime - now) / 1000; //get the lefttime
                try{ message.react(emoji.msg.ERROR); }catch{}
                not_allowed = true;
                const idkd = new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                return message.channel.send({embeds: [idkd]}); //send an information message
            }
        }
        timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
        try{
            // if Command has specific permission return error
            if(command.memberpermissions) {
                if (!message.member.permissions.has(command.memberpermissions)) {
                    try{ message.react(emoji.msg.ERROR); }catch{}
                    not_allowed = true;
                    const idkf = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
                    const x = await message.channel.send({embeds: [idkf]})
                    setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 9000)
                    return;
                }
            }
            // if Command has specific permission return error

            if(guildData.djonlycmds.length > 0 && guildData.djonlycmds.join(" ").toLowerCase().split(" ").includes(command.name.toLowerCase())) {
                //Check if there is a Dj Setup
                if(guildData.djRoles.length !== 0){
                    const player = client.manager.players.get(message.guild.id);
                    //create the string of all djs and if he is a dj then set it to true
                    let isdj = false;
                    let leftb = "";
                    if(guildData.djRoles.length === 0)
                    leftb = "No Dj Roles"
                    else
                    for(let i = 0; i < guildData.djRoles.length; i++){
                        if(message.member.roles.cache.has(guildData.djRoles[i])) isdj = true;
                        if(!message.guild.roles.cache.get(guildData.djRoles[i])) continue;
                        leftb += "<@&" + guildData.djRoles[i] + "> , "
                    }

                    if(!isdj && !message.member.permissions.has("ADMINISTRATOR")) {
                        if(!player.queue.current) {
                            try{ message.react(emoji.msg.ERROR); }catch{}
                            not_allowed = true;
                            const opop = new Discord.MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} You need to have one of those Roles:\n${guildData.djonlycmds}`)
                            return message.channel.send({embeds: [opop]}).then(msg => {
                            setTimeout(() => msg.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
                            })
                        }
                        if(player && player.queue.current.requester.id !== message.author.id) {
                            try{ message.react(emoji.msg.ERROR); }catch{}
                            not_allowed = true;
                            const yiyi = new Discord.MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} You need to have one of those Roles:\n${leftb.substr(0, leftb.length-3)}\n\nOr be the Requester (${player.queue.current.requester}) of the current Track!`)
                            return message.channel.send({embeds: [yiyi]}).then(msg => {
                            setTimeout(() => msg.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
                            })
                        }
                    }
                }
            }

            //if there is a SETUP with an EXISTING text channel and its a MUSIC or FILTER COMMAND                              AND NOT in the                         RIGHT CHANNEL return error msg        and if its request only enabled

                if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
                let neededPermissions = [];
                let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "READ_MESSAGE_HISTORY"]
                required_perms.forEach(perm => {
                    if(!message.channel.permissionsFor(message.guild.me).has(perm)){
                    neededPermissions.push(perm);
                    }
                })
                if(neededPermissions.length > 0){
                    const MISSING_BOT_PERMS = new MessageEmbed()
                    .setDescription(`${emoji.msg.ERROR} I need the following permissions to execute this command: ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`)
                    .setColor("RED");
                    return message.channel.send({embeds: [MISSING_BOT_PERMS]});
                }
            }

            const player = client.manager.players.get(message.guild.id);
            
            if(command.parameters) {
                if(command.parameters.type == "music"){
                    //get the channel instance
                    const { channel } = message.member.voice;
                    const mechannel = message.guild.me.voice.channel;
                    //if not in a voice Channel return error
                    setTimeout(() => {
                        message.delete()
                    }, 500)
                    if (!channel) {
                        not_allowed = true;
                        const opop = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
                        return message.channel.send({embeds: [opop]});
                    }
                    //If there is no player, then kick the bot out of the channel, if connected to
                    if(!player && mechannel) {
                        const newPlayer = client.manager.create({
                            guild: message.guild.id,
                            voiceChannel: message.member.voice.channel.id,
                            textChannel: message.channel.id,
                            selfDeafen: true,
                        })
                        newPlayer.destroy();
                    }
                    //if no player available return error | aka not playing anything
                    if(command.parameters.activeplayer){
                        if (!player){
                            not_allowed = true;
                            const udfj = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                            return message.channel.send({embeds: [udfj]});
                        }
                        if (!mechannel){
                            if(player) try{ player.destroy() }catch{ }
                            not_allowed = true;
                            const mmmm = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} I am not connected to a Channel`)
                            return message.channel.send({embeds: [mmmm]});
                        }
                        if(!player.queue.current) {
                            const no = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                            return message.channel.send({embeds: [no]})
                        }
                    }
                    //if no previoussong
                    if(command.parameters.previoussong){
                        if (!player.queue.previous || player.queue.previous === null){
                            not_allowed = true;
                            const ifkf = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} There is no previous song yet!`)
                            return message.channel.send({embeds: [ifkf]});
                        }
                    }
                    //if not in the same channel --> return
                    if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                        const ikkkk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
                        return message.channel.send({embeds: [ikkkk]});
                    }
                    //if not in the same channel --> return
                    if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                        const ikk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
                        return message.channel.send({embeds: [ikk]});
                    }
                }
            }
            //run the command with the parameters:  client, message, args, user, text, prefix,
            if(not_allowed) return;
            command.run(client, message, args, guildData, player, prefix);
            web.send(`${message.author.tag} ran ${command.name}`)
        } catch (e) {
            console.log(String(e.stack).red)
            const dkdk = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor("An Error Occured")
            .setDescription(`\`\`\`${e.message}\`\`\``)
            const x = await message.channel.send({embeds: [dkdk]})
            setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
            return;
        }
    }
    else //if the command is not found send an info msg

    return;
}
