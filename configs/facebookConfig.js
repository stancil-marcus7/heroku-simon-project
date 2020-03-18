const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const Player = mongoose.model("Player");
require('dotenv').config();

module.exports = passport => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://simonpassportgame.herokuapp.com/auth/facebook/simon",
        profileFields: ['id', 'displayName', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
        Player.findOrCreate({facebookId: profile.id, facebookDisplayName: profile.displayName}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      }
    ));
}