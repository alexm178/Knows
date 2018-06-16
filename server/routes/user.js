const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Post = require('../database/models/post')
const Comment = require('../database/models/comment')
const aws = require('aws-sdk')

router.post('/', (req, res) => {
    // ADD VALIDATION
  User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, img: "https://s3.us-east-2.amazonaws.com/knows/avatar.png", cover: "https://s3.us-east-2.amazonaws.com/knows/iceland.jpg"}), req.body.password)
  .then(
    user => {
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          res.json({err: 'login'})
        } else {
          res.json({authenticated: true, user: user})
        }
      })
    }
  )
  .catch(err => {
    res.json({err: err})
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
      User.findByIdAndUpdate(req.user._id, {img: "https://s3.us-east-2.amazonaws.com/knows/" + req.body.fileName}, {new: true}).exec()
    }
  })
})

router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id, (err, profile) => {
    res.json({profile: profile})
  })
})

router.put('/follow', (req, res) => {
  User.findByIdAndUpdate(req.query.id, {$push: {'followers': req.user._id}}, (err, user) => {
    if (err) {
      console.log(err);
      res.json({err: err});
    } else {
      User.findByIdAndUpdate(req.user._id, {$push: {'following': req.query.id}}, (err, uer) => {
        if (err) {
          console.log(err);
          res.json({err: err})
        } else {
          res.json('success')
        }
      })
    }
  })
})



module.exports = router
