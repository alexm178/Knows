const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Post = require('../database/models/post')
const Comment = require('../database/models/comment')
const aws = require('aws-sdk')

router.post('/', (req, res) => {
    // ADD VALIDATION
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: "Sorry, the email address " + req.body.email + " is already in use"
            })
        }
        else {

            User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, img: "https://s3.us-east-2.amazonaws.com/knows/avatar.png", cover: "https://s3.us-east-2.amazonaws.com/knows/iceland.jpg"}), req.body.password)
            .then(
              user => {
                res.json({authenticated: true, user: user})
              }
            )
            .catch(err => {return res.json(err)})
        }
    })
})

router.post('/avatar', (req, res) => {
  console.log(req.body)
  var s3 = new aws.S3({signatureVersion: 'v4', region: 'us-east-2'});


  var params = {
    Bucket: 'knows',
    Key: req.body.fileName,
    Expires: 120,
    ContentType: req.body.fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log({err: err});
      res.json(err)
    } else {
      res.json({signedUrl: data})
      User.findByIdAndUpdate(req.user._id, {img: "https://s3.us-east-2.amazonaws.com/knows/" + req.body.fileName}, {new: true}, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          user.posts.forEach((post) => {
            Post.findByIdAndUpdate(post, {$set: {'author.img': user.img}}, (err, post) => {
              if (err) {
                console.log(err)
              }
            })
          })
          Comment.find({'author.id': user._id}, (err, comments) => {
            comments.forEach((comment) => {
              comment.author.img = user.img;
              comment.save()
            })
          })
        }
      })
    }
  })
})

router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id, (err, profile) => {
    res.json({profile: profile})
  })
})



module.exports = router
