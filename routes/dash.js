var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');


router.get('/', isLoggedIn, (req, res) => {
  console.log('/')
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
        res.render('dash', {user: user, posts: posts})
      }
    })
})


router.post('/dash/:id/newPost', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err) {
      console.log(err)
      res.redirect('/dash/' + req.params.id)
    } else {
      newPost(req, res);
    }
  })
})

function newPost(req, res) {
  User.findById(req.params.id, (err, profile) => {
    if (err) {
      console.log (err)
    } else {
    Post.create({content: req.body.content}, (err, post) => {
      if (err) {
        console.log(err);
      } else {
        post.date = Date.now();
        post.author.id = req.user._id;
        post.author.name = req.user.firstName + ' ' + req.user.lastName;
        post.author.img = req.user.img;
        post.user.id = profile.id;
        post.user.name = profile.firstName + ' ' + profile.lastName;
        post.type = 'post';
        post.save();
        profile.posts.push(post);
        profile.save();
        res.json(post);
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
