require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');;
var cors = require('cors')
var cookieParser = require('cookie-parser')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const path = require('path')


const app = express();
app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'jade')

app.use(cors({credentials: true, origin: 'http://localhost:5000'}));

const findOrCreate = require('mongoose-findorcreate')
var flash=require("connect-flash");
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


app.use(flash());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3001/auth/google/simon",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    Player.findOrCreate({ googleId: profile.id, googleDisplayName: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));

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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/simon",
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    Player.findOrCreate({facebookId: profile.id, facebookDisplayName: profile.displayName}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb+srv://admin-marcus:Shiji147@simoncluster-7imve.mongodb.net/simonGameDB", { useUnifiedTopology: true, useNewUrlParser: true } );
mongoose.set("useCreateIndex", true);

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

const Player = mongoose.model("Player", playerSchema);

passport.use(Player.createStrategy());
 
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
Player.findById(id, function(err, user) {
    done(err, user);
});
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/simon', passport.authenticate('google', {successRedirect: 'http://localhost:3000', failureRedirect: '/', failureFlash: 'Authentication failed'}));
  
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/simon', passport.authenticate('facebook', {successRedirect: 'http://localhost:3000', failureRedirect: '/', failureFlash: 'Authentication failed'}));

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { res.send({authenticated: 'User not found'}); return;}
    req.logIn(user, function(err) {
      if (err) { res.send({authenticated: 'error occured'}); return; }
      req.session.save(() => {
        console.log('success')
        res.send({authenticated: true});
        return;
      })
    });
  })(req, res, next);
});

app.post('/register', (req, res) => {
  Player.findOne({email: req.body.email}, (err, user) => {
    if (user){
      res.status(404).send('Error creating user');
    } else {
      Player.register({username: req.body.username, email: req.body.email}, req.body.password, function(err, user) {
        if (err) {
            res.status(404).send('Error creating user')
          } else {
            passport.authenticate("local")(req, res, function(){
            res.redirect("/")
          });
          }
        })
     }
  });
})


app.route("/logout")
    .get((req,res) => {
        req.logout();
        res.redirect("/")
})

app.route("/submit")
    .post((req, res) => {
      if(req.isAuthenticated()){
        let mode = req.body.mode;
      let score = req.body.score;

        Player.findById(req.user.id, (err, user) => {
            if (err) {
                res.send(err, 'could not find player')
            } else  {
                if (user && mode !== null){
                    if (mode === 'strict'){
                      if(score > user.strictModeScore){
                        user.strictModeScore = score;
                      }
                    } else {
                      if (score > user.regularModeScore){
                        user.regularModeScore = score;
                      }
                    }
                    user.save(err => {
                      if (err){
                        res.status(404).send(err)
                      }
                    });
                }
            }
        })
      } else {
        res.redirect('/')
      }
    });

app.route("/players")
    .get(function(req,res){
        let { lim } = req.query;
        Player.find({})
        .sort({strictModeScore: -1})
        .exec(function(err, players){
            players = players.map(player => player)
            let returnPlayers = players.filter((player, id) => id < lim);
            if (err){
                res.send(err, "Cannot retrieve players");
            } else {
                res.send(returnPlayers);
            }
        })
    })

app.get("/user", (req, res) => {
  Player.findById(req.user.id, (err, user)=>{
    if (err) {
      res.send(err, 'could not find player')
    } else {
      res.send(user);
    }
  })
})

app.get("/rank", (req, res) => {
  if(req.isAuthenticated()){
    let returnPlayers =[];
    Player.findById(req.user.id, (err, user)=>{
    if (err) {
      res.send(err, 'could retrieve rank')
    } else {
      Player.find({})
        .sort({strictModeScore: -1})
        .exec(function(err, players){
          returnPlayers = players.map(player => player);
          let rank = 0;
          console.log(req.user.id);
          console.log(returnPlayers)
          for(let i = 0; i < returnPlayers.length; i++){
            if (req.user.id === returnPlayers[i].id){
              console.log(`There's a match!`)
              rank = i;
            }
          }
          rank+=1;

          res.send({rank})
        })

        
    }
  })
  } else {
    res.send({rank: null});
  }
  
})

app.get('/loggedIn', (req, res) => {
  if (req.isAuthenticated()){
    res.send(true)
  } else {
    res.send(false)
  }

  console.log(req.isAuthenticated())
})

  app.get("/",(req, res) =>{
    res.send("yer")
  })

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "simon", "build", "index.html"));
});

app.listen(PORT, function() { 
    console.log("Server started on port 3001");
});



