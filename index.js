require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');;
var cors = require('cors')
var cookieParser = require('cookie-parser')
const path = require('path');
const Player = require('./Player')
const routes = require('./routes');

const app = express();
app.use(express.static(path.join(__dirname, 'simon/build')));

app.use(cors({credentials: true, origin: 'http://localhost:3001'}));

var flash=require("connect-flash");

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.MAIN_SECRET));

app.use(session({
    secret: process.env.MAIN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    }
}))

app.use(passport.initialize());
app.use(passport.session());

require('./configs/googleConfig')(passport);
require('./configs/localConfig')(passport);
require('./configs/facebookConfig')(passport);

mongoose.connect("mongodb+srv://admin-marcus:Shiji147@simoncluster-7imve.mongodb.net/simonGameDB", { useUnifiedTopology: true, useNewUrlParser: true } );
mongoose.set("useCreateIndex", true);

passport.use(Player.createStrategy());
 
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
Player.findById(id, function(err, user) {
    done(err, user);
});
});

app.use("/", routes)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, function() { 
    console.log("Server started on port 3001");
});



