const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Comment = require('../database/models/comment')
const aws = require('aws-sdk')

router.post('/', (req, res) => {
    // ADD VALIDATION
  User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, img: "http://d2nyad70j27i0j.cloudfront.net/avatar.png", cover: "http://d2nyad70j27i0j.cloudfront.net/iceland.jpg"}), req.body.password)
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

router.post('/photo', (req, res) => {
  var s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-2',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
  });


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
      if (req.query.which === "avatar") {
        console.log("avatar")
        User.findByIdAndUpdate(req.user._id, {$set: {img: "http://d2nyad70j27i0j.cloudfront.net/" + req.body.fileName}}).exec()
      } else {
        console.log("cover")
        User.findByIdAndUpdate(req.user._id, {$set: {cover: "http://d2nyad70j27i0j.cloudfront.net/" + req.body.fileName}}).exec()
      }
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

router.get('/follows/:which', (req, res) => {
  User.findById(req.query.id).populate({path: req.params.which, select: 'firstName lastName img'}).exec().then(
    user => {
      var follows = (req.params.which === "following" ? user.following : user.followers)
      var modifiedFollows = follows.map((follow) => {
        follow.isFollowing = req.user.following.some((userFollowing) => {
          return userFollowing.equals(follow._id);
        })
        return follow
      })
      res.json({follows: modifiedFollows})
    }
  ).catch(err => {
    console.log(err);
    res.json({err: err})
  })
})


router.get("/following", (req, res) => {
  var terms = req.query.terms.split(" ");
  terms = terms.map((term) => {
    return new RegExp(term, "i")
  })
  User.findById(req.user._id, "-_id following followers", (err, user) => {
    if (err) {
      console.log(err)
    } else {
      User.aggregate([
        {
          $match:
            { $or: [
              {firstName:
                {$in: terms}
              },
              {lasttName:
                {$in: terms}
              },
            ]}
          },
          {
            $project: {
              isFollowing: {
                $in: [
                  "$_id", user.followers
                ]
              },
              firstName: 1,
              lastName: 1,
              img: 1
            }
          },
          {
            $sort: {
              isFollowing: -1
            }
          },
          {
            $limit: 10
          }
        ])
        .then(
          users => {
            res.json(users)
          }
        ).catch(
          err => {
            console.log(err);
            res.json({err: err})
          }
        )
    }
  })
})



module.exports = router
