var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');


router.get("/user/:info/:id?", (req, res) => {
  switch (req.params.info) {
    case "following":
      getFollowing(req, res);
      break;
    case "followers":
      getFollowers(req, res);
      break;
  }
})

function getFollowing(req, res) {
  var id = req.user._id;
  if (req.params.id) {
    id = req.params.id;
  }
  User.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user.following)
    }
  })
}

function getFollowers(req, res) {
  var id = req.user._id;
  if (req.params.id) {
    id = req.params.id;
  }
  User.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user.followers)
    }
  })
}

router.post("/user/:action/:id", isLoggedIn, (req, res) => {
  switch(req.params.action) {
    case "addFollowing":
      addFollowing(req, res);
      break;
  }
})

function addFollowing(req, res) {
  User.findById(req.params.id, (err, following) => {
    if (err) {
      console.log(err);
    } else {
      var newFollowing = {
        id: following._id,
        name: following.firstName + ' ' + following.lastName,
        img: following.img
      };
      User.findById(req.user._id, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          var follower = {
            id: user._id,
            name: user.firstName + ' ' + user.lastName,
            img: user.img
          }
          following.followers.push(follower);
          following.save();
          user.following.push(newFollowing);
          user.save();
          res.end('{"success" : "Followed Successfully", "status" : 200}');
        }
      })
    }
  })
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
