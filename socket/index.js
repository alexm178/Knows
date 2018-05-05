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

ioFunctions.likeOrComment = function(data, socket) {
  Post.findById(data.postId, (err, post) => {
    User.findById(post.user.id, (err, user) => {
      if (user.socket) {
        socket.to(user.socket).emit('notification', {notification: user.notifications[user.notifications.length - 1], role: 'user'})
      }
    })
    if (!(post.user.id.equals(post.author.id))) {
      User.findById(post.author.id, (err, author) => {
        if (author.socket) {
          socket.to(author.socket).emit('notification', {notification: author.notifications[author.notifications.length - 1], role: 'author'})
        }
      })
    }
  })
}

ioFunctions.multipleUserPost = function(data, socket) {
  User.findById(data.post.user.id, (err, user) => {
    if (user.socket) {
      socket.to(user.socket).emit('notification', {notification: user.notifications[user.notifications.length - 1], role: 'post'})
    }
  })
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
