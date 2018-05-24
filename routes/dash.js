var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');


router.get('/', isLoggedIn, (req, res) => {
  res.redirect('/dash/' + req.user._id)
})

router.get('/dash/:id', isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('posts').then((user) => {
      var posts = user.posts;
      if (req.user.following.length > 0) {
        user.following.forEach((following) => {
          User.findById(following.id).populate('posts').then((follow) => {
            follow.posts.forEach((post) => {
              posts.push(post)
            })
          }).then(() => {
            res.render('dash', {user: user, posts: posts.sort((a, b) => {
              return b.date - a.date
            })})
          })
        })
      } else {
        res.render('dash', {user: user, posts: posts.sort((a, b) => {
          return b.date - a.date
        })})
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
