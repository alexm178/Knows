var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res) => {
  res.redirect('/dash/' + req.user._id)
});


router.get('/logout', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    user.socket = null;
    user.save();
  })
  req.logout();
  res.redirect('/login');
})

//===================
router.get('/signup', (req, res) => {
  res.render('signup');
})

router.post('/signup', (req, res) => {
  User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, email: req.body.email, img: req.body.img}), req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('login/signup');
    } else {
      req.login(user, function(err){
        if(err) {
          console.log(err)
        } else {
            return res.redirect('/dash/' + req.user._id)
        }
      });
    }
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;