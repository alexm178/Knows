var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');

router.get("/post/:action/:postId", isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'comments':
      getComments(req, res);
      break;
    case 'likes':
      getLikes(req, res);
      break;
    case 'show':
      showPost(req, res);
      break;
  }
})

function getComments(req, res) {
  Post.findById(req.params.postId).populate("comments").exec(function (err, post) {
    res.json(post.comments);
  })
}

function getLikes(req, res) {
  Post.findById(req.params.postId).populate("likes").exec(function (err, post) {
    res.json(post.likes);
  })
}

function showPost(req, res) {
  User.findById(req.user._id, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      Post.findById(req.params.postId, (err, post) => {
        res.render('show', {user: user, posts: [post]})
      })
    }
  })
}


router.post("/post/:action/:id/:postId?", isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'comment':
      newComment(req, res);
      break;
    case 'like':
      likePost(req, res);
      break;
    case 'new':
      newPost(req, res);
      break;
  }
})

function newComment(req, res) {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      console.log(err)
    } else {
      manageSubs(req, post);
      var newComment = new Comment(formatComment(req, post)).save()
      .then(
        (comment) => {
          post.comments.push(comment._id);
          post.save()
          .then(
            (post) => {
              notifyAuthor(req, post);
              notifySubs(req, post);
              res.json(comment);
            }
          )
          .catch(
            (err) => console.log(err)
          )
        }
      )
      .catch(
        (err) => console.log(err)
      )
    }
  })
}

function manageSubs(req, post) {
  var isSub = post.subs.some((sub) => {
    return sub.equals(req.user._id)
  })
  if (!isSub && !post.author.id.equals(req.user._id)) {
    post.subs.push(req.user._id);
    post.save()
  }
}

function formatComment(req, post) {
  var comment = {};
  comment.content = req.body.content;
  comment.date = Date.now();
  comment.author = {
    id: req.user._id,
    name: req.user.firstName + ' ' + req.user.lastName
  };
  comment.author.img = req.user.img;
  comment.post = post._id;
  return comment
}

function notifyAuthor(req, post) {
  User.findById(post.author.id, (err, author) => {
    var notification = {
        userName: req.user.firstName + ' ' + req.user.lastName,
        userId: req.user._id,
        action: "commented",
        targetType: post.type,
        targetId: post._id,
    }
    author.notifications.push(notification);
    author.save();
  })
}

function notifySubs(req, post) {
  post.subs.forEach((sub) => {
    if (!sub.equals(req.user._id)) {
        var notification = {
          userName: req.user.firstName + ' ' + req.user.lastName,
          userId: req.user._id,
          action: "also commented",
          targetType: post.type,
          targetId: post._id,
          possessive: post.author.name + "'s",
        };
        User.update({_id: sub}, {$push: {notifications: notification}}, {upsert: true}, function(err) {
          if (err) {
            console.log(err)
          } 
        })
      }
    })
}


function likePost(req, res) {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      console.log(err)
    } else {
      var newLike = {
        id: req.user._id,
        name: req.user.firstName + ' ' + req.user.lastName,
        img: req.user.img
      };
      post.likes.push(newLike);
      post.save();
      createLikeNotification(post, req, res);
      res.end('{"success" : "Liked Successfully", "status" : 200}');
    }
  })
}

function createLikeNotification(post, req, res) {
  User.findById(post.author.id, (err, author) => {
    if (err) {
      console.log(err)
    } else {
      var notification = {
          userName: req.user.firstName + ' ' + req.user.lastName,
          userId: req.user._id,
          action: "liked",
          targetType: post.type,
          targetId: post._id,
      }
      author.notifications.push(notification);
      author.save();
    }
  })
}

function newPost(req, res) {
  User.findById(req.params.id, (err, profile) => {
    if (err) {
      console.log (err)
    } else {
    Post.create({content: req.body.content}, (err, post) => {
      if (err) {
        console.log(err);
      } else {
        post.date = Date.now();
        post.author.id = req.user._id;
        post.author.name = req.user.firstName + ' ' + req.user.lastName;
        post.author.img = req.user.img;
        post.type = 'post';
        post.save();
        profile.posts.push(post);
        profile.save();
        res.json(post);
      }
    })
   }
  })
}


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
