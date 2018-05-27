var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Album = require('../models/album.js')


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
    case "avatar":
      updateAvatar(req, res);
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

function updateAvatar(req, res) {
  saveImage(req, res)
}

var multer = require('multer');
var path = require('path');
var fs = require('fs')

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


const storage = multer.diskStorage({
  destination: './public/temp/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
}).single('avatar')



function saveImage(req, res) {
  upload(req, res, (err) => {
    if (err) {
      console.log(err)
    } else {
      fs.readFile(req.file.path, function (err, data) {
        if (err) {
          throw err;
          return res.end('Error')
        }
        var fileName = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)
        var params = {Bucket: 'knows', Key: fileName, Body: data, ACL: 'public-read'};
        s3.putObject(params, function(err, data) {
          if (err) {
            console.log(err)
          } else {
            var imgUrl = 'https://s3.us-east-2.amazonaws.com/knows/' + fileName
            User.findByIdAndUpdate(req.user._id, { $set: { img: imgUrl }})
            .then(
              user => {
                res.redirect('/dash/' + req.user._id)
                fs.unlink(req.file.path, function(err) {
                  if (err) {
                    console.log(err)
                  }
                })
                user.albums.forEach((albumId) => {
                  Album.findById(albumId, (err, album) => {
                    if (err) {
                      console.log(err)
                    } else if (album.name === 'Profile Pictures') {
                      album.photos.push(imgUrl);
                      album.save()
                    }
                  })
                })
              }
            )
            .catch(
              err => {
                throw (err)
                res.end('error')
              }
            )
          }
        });
      });
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
