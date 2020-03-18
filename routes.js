const passport = require('passport');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Player = mongoose.model("Player");

router.get('/auth/google', passport.authenticate('google', { scope: ['profile']}));

router.get('/auth/google/simon', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/', failureFlash: 'Authentication failed'}));
  
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/simon', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/', failureFlash: 'Authentication failed'}));

router.post('/login', function(req, res, next) {
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

router.post('/register', (req, res) => {
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

router.route("/logout")
    .get((req,res) => {
        req.logout();
        res.redirect("/")
})

router.route("/submit")
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

router.route("/players")
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

router.get("/user", (req, res) => {
  Player.findById(req.user.id, (err, user)=>{
    if (err) {
      res.send(err, 'could not find player')
    } else {
      res.send(user);
    }
  })
})

router.get("/rank", (req, res) => {
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

router.get('/loggedIn', (req, res) => {
  if (req.isAuthenticated()){
    res.send(true)
  } else {
    res.send(false)
  }

  console.log(req.isAuthenticated())
})

module.exports = router;