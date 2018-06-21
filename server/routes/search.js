const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const Post = require('../database/models/post')

function queryUsers(terms) {
  return User.find(
   { $text: { $search: terms } },
   { score: { $meta: "textScore" } }
 ).sort( { score: { $meta: "textScore" } } ).select('firstName lastName cover img followers following')
}

function queryPosts(terms) {
  return Post.find(
     { $text: { $search: terms } },
     { score: { $meta: "textScore" } }
   ).populate({
     path: 'author',
     select: 'firstName lastName img'
   }).sort( { score: { $meta: "textScore" } } )
}

router.get('/', (req, res) => {
  queryUsers(req.query.terms).exec().then(users => {
    queryPosts(req.query.terms).exec().then(posts => {
      res.json({users: users, posts: posts})
    }).catch(err => {console.log(err); res.json({err: err})})
  }).catch(err => {console.log(err); res.json({err: err})})
})

module.exports = router
