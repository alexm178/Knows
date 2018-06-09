const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Post = require('../database/models/post')

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

module.exports = router
