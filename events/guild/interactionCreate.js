const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); //Loading all needed functions
const  premiumGuildSchema = require("../../models/premium-guild")
const { MessageEmbed } = require(`discord.js`);

const web = new Discord.WebhookClient({ url: 'https://discord.com/api/webhooks/892810763620741150/NPe1z6Hq0NnOagvK5V2ikB5MflPJhIc-T4s9Atj1DC8J6-oRT7iE-tJ12H9SQyctezoY' });
//here the event starts
module.exports = async (client, interaction) => {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!interaction.guild || !interaction.channel) return;
    // if the message  author is a bot, return aka ignore the inputs
    if (interaction.user.bot) return;
    // Gets guild data
    const guildData = await findOrCreateGuild(client, { id: interaction.guild.id });
    //get the current prefix from the database
    let prefix = guildData.prefix;
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    //get the command name lol
    const cmd = interaction.commandName
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    let not_allowed = false;
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
        //CHECK IF IN A BOT CHANNEL OR NOT
        if(guildData.botChannels.toString() !== ""){
            if (!guildData.botChannels.includes(interaction.channel.id) && !interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                let leftb = "";
                for(let i = 0; i < guildData.botChannels.length; i++){
                    leftb  +="<#" +guildData.botChannels[i] + "> / "
                }
                not_allowed = true;
                const idk = new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} This Channel Is Blacklisted You Can\'t Use The Commands Here`)
                .addField(`Whitelisted Channels`, `${leftb.substr(0, leftb.length - 3)}`)
                interaction.reply({embeds: [idk], ephemeral: true })
                return;
            }
        }  
    }

    if (command)    {
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return;
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")){
            interaction.reply({ content: `${emoji.msg.ERROR} I don't have \`EMBED LINKS\` permssion`, ephemeral: true })
            return;
        }
            if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
                client.cooldowns.set(command.name, new Discord.Collection());
            }
            const now = Date.now(); //get the current time
            const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
            const cooldownAmount = (command.cooldown || 2.5) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
            if (timestamps.has(interaction.user.id)) { //if the user is on cooldown
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
                if (now < expirationTime) { //if he is still on cooldonw
                    const timeLeft = (expirationTime - now) / 1000; //get the lefttime
                    not_allowed = true;
                    const idkd = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    return interaction.reply({embeds: [idkd]}); //send an information message
                }
            }
            timestamps.set(interaction.user.id, now); //if he is not on cooldown, set it to the cooldown
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
        try{
            // if Command has specific permission return error
            if(command.memberpermissions) {
                if (!interaction.member.permissions.has(command.memberpermissions)) {
                    not_allowed = true;
                    const idkf = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
                    interaction.reply({ embeds: [idkf], ephemeral: true })
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
                        if(interaction.member.roles.cache.has(guildData.djRoles[i])) isdj = true;
                        if(!interaction.guild.roles.cache.get(guildData.djRoles[i])) continue;
                        leftb += "<@&" + guildData.djRoles[i] + "> , "
                    }

                    if(!isdj && !interaction.member.permissions.has("ADMINISTRATOR")) {
                        if(!player.queue.current) {
                            not_allowed = true;
                            const opop = new Discord.MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} You need to have one of those Roles:\n${guildData.djonlycmds}`)
                            return interaction.reply({embeds: [opop], ephemeral: true })
                        }
                        if(player && player.queue.current.requester.id !== interaction.author.id) {
                            not_allowed = true;
                            const yiyi = new Discord.MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} You need to have one of those Roles:\n${leftb.substr(0, leftb.length-3)}\n\nOr be the Requester (${player.queue.current.requester}) of the current Track!`)
                            return interaction.reply({embeds: [yiyi], ephemeral: true })
                        }
                    }
                }
            }

            //if there is a SETUP with an EXISTING text channel and its a MUSIC or FILTER COMMAND                              AND NOT in the                         RIGHT CHANNEL return error msg        and if its request only enabled

            if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
                let neededPermissions = [];
                let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "MOVE_MEMBERS" , "READ_MESSAGE_HISTORY"]
                required_perms.forEach(perm => {
                    if(!interaction.channel.permissionsFor(interaction.guild.me).has(perm)){
                        neededPermissions.push(perm);
                    }
                })
                if(neededPermissions.length > 0){
                    const MISSING_BOT_PERMS = new MessageEmbed()
                    .setDescription(`${emoji.msg.ERROR} I need the following permissions to execute this command: ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`)
                    .setColor("RED");
                    return interaction.editReply({embeds: [MISSING_BOT_PERMS]});
                }    
            }

            const player = client.manager.players.get(interaction.guild.id);
        
            if(command.parameters) {
                if(command.parameters.type == "music"){
                    //get the channel instance
                    const { channel } = interaction.member.voice;
                    const mechannel = interaction.guild.me.voice.channel;
                    //if not in a voice Channel return error
                    if (!channel) {
                        not_allowed = true;
                        const opop = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
                        return interaction.reply({ embeds: [opop] });
                    }
                    //If there is no player, then kick the bot out of the channel, if connected to
                    if(!player && mechannel) {
                        const newPlayer = client.manager.create({
                            guild: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
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
                            return interaction.editReply({embeds: [udfj]});
                        }
                        if (!mechannel){
                            if(player) try{ player.destroy() }catch{ }
                            not_allowed = true;
                            const mmmm = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} I am not connected to a Channel`)
                            return interaction.editReply({embeds: [mmmm]});
                        }
                        if(!player.queue.current) {
                            const no = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                            return interaction.editReply({embeds: [no]})
                        }
                    }
                    //if no previoussong
                    if(command.parameters.previoussong){
                        if (!player.queue.previous || player.queue.previous === null){
                            not_allowed = true;
                            const ifkf = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} There is no previous song yet!`)
                            return interaction.editReply({embeds: [ifkf]});
                        }
                    }
                    //if not in the same channel --> return
                    if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                        const ikkkk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
                        return interaction.editReply({embeds: [ikkkk]});
                    }
                    //if not in the same channel --> return
                    if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                        const ikk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
                        return interaction.editReply({embeds: [ikk]});
                    }
                }
            }
            //run the command with the parameters:  client, message, args, user, text, prefix,
            if(not_allowed) return;

            if(command.runslash === undefined) {
                const hahafunnylol = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} \`${command.name}\` Is probably not coded right or theres an error`)
                return interaction.reply({ embeds: [hahafunnylol], ephemeral: true })
            }
            command.runslash(client, interaction, guildData, player, prefix);
            web.send(`${interaction.user.tag} ran ${command.name}`)
        } catch (e) {
            console.log(String(e.stack).red)
            const dkdk = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor("An Error Occured")
            .setDescription(`\`\`\`${e.message}\`\`\``)
            interaction.reply({ embeds: [dkdk] })
            return;
        }
    }
    else //if the command is not found send an info msg
    return;
}