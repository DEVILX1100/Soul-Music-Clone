const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
};

const playlistSchema = new mongoose.Schema({
  username: String,
  userID: reqString,
  playlistName: reqString,
  playlistArray: Array
});

module.exports = mongoose.model("playlists", playlistSchema);