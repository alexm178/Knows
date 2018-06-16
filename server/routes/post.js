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
  Post.findByIdAndUpdate(req.query.id, {$push: {likes: req.user._id}, $inc: {likeCount: 1}}, (err, post) => {
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
    Post.findById(req.params.id).populate({
      path: 'author',
      select: 'firstName lastName img'
    }).then(
      post =>{
        res.json({posts: modifyPosts([post], req.user._id)})
      }
    ).catch(
      err => {
        console.log(err)
        res.json({err: err})
      }
    )
  } else {
    Post.find({$or: [{'author': req.user._id}, {'author': {$in: req.user.following}}]})
    .populate({
      path: 'author',
      select: 'firstName lastName img'
    }).then(
      posts =>{
        res.json({posts: modifyPosts(posts, req.user._id)})
      }
    ).catch(
      err => {
        console.log(err)
        res.json({err: err})
      }
    )
  }
})

router.get('/profile/:id', (req, res) => {
  Post.find({'author': req.params.id}).populate({
    path: 'author',
    select: 'firstName lastName img'
  }).then(
    posts =>{
      res.json({posts: modifyPosts(posts, req.user._id)})
    }
  ).catch(
    err => {
      console.log(err)
      res.json({err: err})
    }
  )
})

router.get('/comments', (req, res) => {
  Comment.find({post: req.query.id}).populate({
    path: 'author',
    select: 'firstName lastName img'
  }).then(
    comments => {
      res.json({comments: comments})
    }
  ).catch (
    err => {
      console.log(err);
      res.json({err: err})
    }
  )
})

function modifyPosts(posts, id) {
  var modifiedPosts = posts.map((post) => {
    var liked = post.likes.some((like) => {
      return like.equals(id)
    });
    post.liked = liked;
    post.likes = null;
    return post
  })
  return modifiedPosts;
}

router.get('/likes', (req, res) => {
  Post.findById(req.query.id).populate({path: 'likes', select: 'firstName lastName img'}).exec().then(
    post => {
      var likes = post.likes.map((like) => {
        like.isFollowing = req.user.following.some((follow) => {
          return follow.equals(like._id);
        })
        return like
      })
      console.log(likes)
      res.json({likes: likes})
    }
  ).catch(err => {
    console.log(err);
    res.json({err: err})
  })
})

module.exports = router
