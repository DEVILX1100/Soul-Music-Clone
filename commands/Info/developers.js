const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  Discord
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const { swap_pages2 } = require("../../handlers/functions");
module.exports = {
    name: "developers",
    category: "Info",
    cooldown: 3,
    usage: "help [Command]",
    description: "Shows The Developers Of Soul Music",
    run: async (client, message, args, guildData, player, prefix) => {

        const nowxd = new MessageEmbed()
        .setAuthor(`Astroz Music Developers`)
        .setDescription(
`
\u200b
<:arrow:895998417384407050> [\`TheBrettYT\`](https://discord.com/users/479674000356671489)

<:arrow:895998417384407050> [\`*₊⋆SHIVAMPLAYZ †ᴼˢ†ᴿᴺˣ🍷\`](https://discord.com/users/852834834909102110)

<:arrow:895998417384407050> [\`Oᴍ\`](https://discord.com/users/853184935384711178)

<:arrow:895998417384407050> [\`Mr. Yogi\`](https://discord.com/users/772342884325916694)

<:arrow:895998417384407050> [\`! ZGOD\`](https://discord.com/users/241370723317317633)
\u200b
`
)
.setFooter(ee.footertext, ee.footericon)
.setColor(`#303037`)
message.channel.send({ embeds: [nowxd] })



    }
}