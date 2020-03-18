const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')

const playerSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    regularModeScore: Number,
    strictModeScore: Number,
    facebookId: String,
    facebookDisplayName: String,
    googleId: String,
    googleDisplayName: String
});

playerSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});
playerSchema.plugin(findOrCreate);

module.exports = Player = mongoose.model("Player", playerSchema);