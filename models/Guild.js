const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../botconfig/config.json");

module.exports = mongoose.model("Guild", new Schema({

	/* REQUIRED */
	id: { type: String }, // Discord ID of the guild
    
	/* CONFIGURATION */
	prefix: { type: String, default: config.prefix }, // Default or custom prefix of the guild
    
	/* AUTO JOIN */
	ajenabled: { type: Boolean, default: false },
	voiceChannel: { type: String, default: null },
	textChannel: { type: String, default: null },

	/* SERVER SETTINGS */
    pruning: { type: Boolean, default: true },
	announce: { type: Boolean, defaylt: true },
	djonlycmds: { type: Array, default: ["autoplay", "clearqueue", "forward", "loop", "pause", "resume", "remove", "replay", "rewind", "seek", "shuffle", "skip", "stop", "volume"] },
	djRoles: { type: Array, default: [] },
	botChannels: { type: Array, default: [] }
}));
