const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Post = require('../database/models/post')
const Comment = require('../database/models/comment')

router.post('/', (req, res) => {
  Post.create(req.body, (err, post) => {
    if (err) {
      res.json({err: err})
    } else {
      User.findById(req.user._id, (err, user) => {
        user.posts.push(post._id)
        user.save()
      })
      res.json({post: post})
    }
  })
})

router.post('/comment/:id', (req, res) => {
  Comment.create(req.body, (err, comment) => {
    if (err) {
      console.log(err);
      res.json({err: err})
    } else {
      res.json({comment: comment})
      Post.findById(req.params.id, (err, post) => {
        if (err) {
          console.log(err);
          res.json({err: err})
        } else {
          post.comments.push(comment._id);
          post.save().then(
            post => {
              console.log('flerpy nerples')
            }
          ).catch(
            err => {
              console.log(err)
            }
          )
        }
      })
    }
  })
})

router.put('/like', (req, res) => {
  Post.findById(req.query.id, (err, post) => {
    if (err) {
      console.log(err);
      res.json({err: err})
    } else {
      post.likes.push(req.body);
      post.save()
      res.json('success')
    }
  })
})

router.get('/dash', (req, res) => {
  User.findById(req.user._id).populate('posts').exec().then(
    user => {
      var posts = [];
      user.posts.forEach((post) => {
        posts.push(post)
      })
      user.following.forEach((following) => {
        User.findById(following).populate('posts').exec().then(
          foundFollowing => {
            foundFollowing.posts.forEach((post) => {
              posts.push(post)
            })
          }
        ).catch(
          err => {
            console.log(err)
            res.json({err: err})
          }
        )
      })
      res.json({posts: posts})
    }
  ).catch(
    err => {
      console.log(err)
      res.json({err: err})
    }
  )
})

router.get('/comments/:id', (req, res) => {
  Post.findById(req.params.id).populate('comments').exec().then(
    post => {
      res.json({comments: post.comments})
    }
  ).catch(
    err => {
      console.log(err);
      res.json({err: err})
    }
  )
})

module.exports = router
