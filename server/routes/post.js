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



module.exports = router
