var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');

var ioFunctions = {};

ioFunctions.id = function(data, socket) {
  User.findById(data.userId, function(err, user) {
    if(err) {
      console.log(err)
    } else {
      user.socket = socket.id;
      user.save();
    }
  });
}

ioFunctions.like = function(data, socket) {
  Post.findById(data.postId, (err, post) => {
    User.findById(post.author.id, (err, postAuthor) => {
      if (postAuthor.socket) {
        socket.to(postAuthor.socket).emit('notification', {notification: postAuthor.notifications[postAuthor.notifications.length - 1]})
        socket.to(postAuthor.socket).emit('newLike', {post: post})
      };
      postAuthor.followers.forEach((follower) => {
        User.findById(follower.id, (err, foundFollower) => {
          if (foundFollower.socket) {
            socket.to(foundFollower.socket).emit('newLike', {post: post})
          }
        })
      })
    })
  })
}

ioFunctions.comment = function(data, socket) {
  Post.findById(data.comment.post).populate('author.id').populate('subs').exec()
    .then(
      (post) => {
        if (post.author.id.socket) {
          socket.to(post.author.id.socket).emit('notification', {notification: post.author.id.notifications[post.author.id.notifications.length - 1]})
          socket.to(post.author.id.socket).emit('newComment', {comment: data.comment})
        };
        post.subs.forEach((sub) => {
          socket.to(sub.socket).emit('notification', {notification: sub.notifications[sub.notifications.length - 1]})
        });
        post.author.id.followers.forEach((follower) => {
          User.findById(follower.id, (err, foundFollower) => {
            if (foundFollower.socket) {
              socket.to(foundFollower.socket).emit('newComment', {comment: data.comment})
            }
          })
        })
      }
    )
    .catch(
      (err) => console.log(err)
    )
}


ioFunctions.post = function(data, socket) {
  User.findById(data.post.author.id).populate('followers').exec((err, author) => {
    if (err) {
      console.log(err)
    } else {
      author.followers.forEach((follower) => {
        User.findById(follower.id, (err, user) => {
          if (user.socket) {
            socket.to(user.socket).emit('post', {post: data.post})
          }
        })
      })
    }
  })
}

module.exports = ioFunctions
