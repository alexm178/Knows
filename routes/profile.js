var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');


router.get('/profile/:id/:collection?', (req, res) => {
  switch (req.params.collection) {
    case undefined:
      getProfile(req, res);
      break;
    case 'Feed':
      getFeed(req, res);
      break;
    case 'Projects':
      getProjects(req, res);
      break;
    case 'Photos':
      getPhotos(req, res);
      break;
  }
})

function getProfile(req, res) {
  User.findById(req.params.id).populate("posts").exec(function(err, profile) {
     if(err) {
       console.log(err)
     } else {
       profile.posts.reverse();
       var editor = (req.user._id.equals(profile.id));
       User.findById(req.user._id, (err, user) => {
         var isFollowing = false;
         user.following.forEach((following) => {
           if (following.id.equals(profile._id)) {
             isFollowing = true;
           }
         })
         res.render('profile', {user: user, profile: profile, editor: editor, isFollowing: isFollowing})
       })
     }
  });
}

function getFeed(req, res) {
  User.findById(req.params.id).populate("posts").exec(function(err, profile) {
     if(err) {
       console.log(err)
     } else {
       res.json({posts: profile.posts})
     }
  });
}

function getProjects(req, res) {
  res.json({html: '<h1>Projects Here</h1>'})
}

function getPhotos(req, res) {
  res.json({html: '<h1>Photos Here</h1>'})
}

router.post('/profile/:id/:action', isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'newPost':
      newPost(req, res);
      break;
    case 'editBio':
      editBio(req, res);
      break;
  }
})


function editBio(req, res) {
  User.findById(req.params.id, (err, profile) => {
    profile.bio = req.body.bio;
    profile.save();
    res.end('{"success" : "Updated Successfully", "status" : 200}');
  })
}

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
