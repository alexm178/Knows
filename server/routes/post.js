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
      Post.findByIdAndUpdate(req.params.id, {$inc: {commentCount: 1}}).exec()
    }
  })
})

router.put('/like', (req, res) => {
  Post.findByIdAndUpdate(req.query.id, {$push: {likes: req.body}}, (err, post) => {
    if (err) {
      console.log(err);
      res.json({err: err})
    } else {
      res.json('success')
    }
  })
})

router.get('/dash/:id?', (req, res) => {
  if (req.params.id) {
    Post.findById(req.params.id, (err, post) => {
      if (err) {
        console.log(err);
        res.json({err: err})
      } else {
        res.json({posts: [post]})
      }
    })
  } else {
    Post.find({$or: [{'author.id': req.user._id}, {'author.id': {$in: req.user.following}}]}, (err, posts) => {
      if (err) {
        console.log(err)
        res.json({err: err})
      } else {
        res.json({posts: posts})
      }
    })
  }
})

router.get('/profile/:id', (req, res) => {
  Post.find({'author.id': req.params.id}, (err, posts) => {
    if (err) {
      console.log(err);
      res.json({err: err})
    } else {
      res.json({posts: posts})
    }
  })
})

router.get('/comments/:postId', (req, res) => {
  Comment.find({post: req.params.postId}, (err, comments) => {
    if(err) {
      console.log(err);
      res.json({err: err})
    } else {
      res.json({comments: comments})
    }
  })
})

module.exports = router
