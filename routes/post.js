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
      console.log(err);
    } else {
      Comment.create({content: req.body.content}, (err, comment) => {
        comment.date = Date.now();
        comment.author.id = req.user._id;
        comment.author.name = req.user.firstName + ' ' + req.user.lastName;
        comment.author.img = req.user.img;
        comment.post = post._id;
        comment.save();
        post.comments.push(comment._id);
        post.save();
        createCommentNotification(post, req, res);
        res.json(comment);
      })
    }
  })
}

function createCommentNotification(post, req, res) {
  User.findById(post.author.id, (err, author) => {
    var notification = {
        userName: req.user.firstName + ' ' + req.user.lastName,
        userId: req.user._id,
        action: "commented",
        targetType: post.type,
        targetId: post._id,
        multipleUsers: (!(post.user.id.equals(post.author.id)))
    }
    author.notifications.push(notification);
    author.save();
    if (notification.multipleUsers) {
      User.findById(post.user.id, (err, user) => {
        user.notifications.push(notification);
        user.save()
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
  User.findById(post.user.id, (err, postOwner) => {
    if (err) {
      console.log(err)
    } else {
      var notification = {
          userName: req.user.firstName + ' ' + req.user.lastName,
          userId: req.user._id,
          action: "liked",
          targetType: post.type,
          targetId: post._id,
          multipleUsers: (!(post.user.id.equals(post.author.id)))
      }
      postOwner.notifications.push(notification);
      postOwner.save();
      if (notification.multipleUsers) {
        User.findById(post.author.id, (err, author) => {
          author.notifications.push(notification);
          author.save();
        })
      }
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
        post.user.id = profile.id;
        post.user.name = profile.firstName + ' ' + profile.lastName;
        post.type = 'post';
        post.save();
        profile.posts.push(post);
        profile.save();
        createPostNotification(post, req, res)
        res.json(post);
      }
    })
   }
  })
}

function createPostNotification(post, req, res) {
  if (post.user.id.equals(post.author.id)) {
    return false;
  } else {
    User.findById(post.user.id, (err, user) => {
      var notification = {
          userName: req.user.firstName + ' ' + req.user.lastName,
          userId: req.user._id,
          action: "posted",
          targetType: post.type,
          targetId: post._id,
          multipleUsers: true
      }
      user.notifications.push(notification);
      user.save();
    })
  }
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
