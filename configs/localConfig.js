const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Player = mongoose.model("Player");
require('dotenv').config()

module.exports = passport => {
    passport.use(new LocalStrategy(
        function(username, password, done) {
          Player.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));
}