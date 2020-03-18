const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const Player = mongoose.model("Player");
require('dotenv').config()

module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://simonpassportgame.herokuapp.com/auth/google/simon",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        profileFields: ['id', 'displayName', 'email']
      },
      function(accessToken, refreshToken, profile, cb) {
        Player.findOrCreate({ googleId: profile.id, googleDisplayName: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
    ));
}