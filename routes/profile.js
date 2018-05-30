var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Album = require('../models/album.js')


router.get('/profile/:id/:collection?/:albumId?', (req, res) => {
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
      getAlbums(req, res);
      break;
    case 'album':
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

function getAlbums(req, res) {
  User.findById(req.user._id).populate('albums')
  .then(
    user => {
      var userAlbums = [];
      user.albums.forEach((album) => {
        userAlbums.push(album);
      });
      res.json({albums: userAlbums})
    }
  )
  .catch(
    err => {console.log(err)}
  )
}

function getPhotos(req, res) {
  Album.findById(req.params.albumId, (err, album) => {
    res.json({album: album})
  })
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



function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
