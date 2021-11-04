/* THIS POSTS STATS TO DISCORDBOTS.ORG */
const publisher = require('discord-publisher');
module.exports = {
    
	/**
     * Starts to post stats to DBL
     * @param {object} client The Discord Client instance
     */
	async init(client){
		
		try {

			var myarray = [];
			client.guilds.cache.keyArray().forEach(async function(item, index) {
			  let guildMember = client.guilds.cache.get(item).memberCount;
			  myarray.push(guildMember)
			})
			let sum = myarray.reduce(function (a, b) {
			  return a + b
			});
	
			let settings = {
				listings: {
					topgg: " ", 
					discordbotsgg: " ", 
					discordboats: "",
					botsondiscord: "",
					botsfordiscord: " ",
					botlistspace: " ",
					topcord: "",
					discordextremelist: "",
					discordbotlist: " ", 
					sentcord: "",
					dbotsco: "",
					discordlabs: "",
					blist: ""
				},
				// the following is required
				clientid: " ",
				servercount: client.guilds.cache.size,
				shardscount: 1,
				shardsid: 0,
				usercount: sum,
				output: true
			}
			await publisher.post(settings)
			setInterval(async () => {
				await publisher.post(settings)
			}, 60000 * 30);
		} catch {/* */}
	}
};