var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var MongoStore = require('connect-mongo')(session);
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  io.to(socket.id).emit('connect');
  socket.on('id', function(data) {
    User.findById(data.userId, function(err, user) {
      if(err) {
        console.log(err)
      } else {
        user.socket = socket.id;
        user.save();
      }
    });
  })
  socket.on('like', function(data) {
    Post.findById(data.postId, (err, post) => {
      User.findById(post.user.id, (err, user) => {
        console.log(user.notifications[0])
        socket.to(user.socket).emit('notification', user.notifications[0])
      })
    })
  })
})





mongoose.connect("mongodb://localhost/knows");
var User = require('./models/user');
var Post = require('./models/post');
var Comment = require('./models/comment');



app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT==========================
app.use(session({
  secret: 'gibson is the best dog',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }));
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========TEST================
// app.get('/test', (req, res) => {
//   res.render('test')
// })
//
// app.post('/test'req, res, next) {
//   console.log(req.files.length)
// })






//ROUTES========================================
app.get('/', isLoggedIn, (req, res) => {
  res.redirect('/dash/' + req.user._id)
})

app.get('/dash/:id', isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('posts').then((user) => {
      var posts = user.posts;
      if (req.user.following.length > 0) {
        user.following.forEach((following) => {
          User.findById(following.id).populate('posts').then((follow) => {
            follow.posts.forEach((post) => {
              posts.push(post)
            })
          }).then(() => {
            res.render('dash', {user: user, posts: posts.sort((a, b) => {
              return b.date - a.date
            })})
          })
        })
      } else {
        res.render('dash', {user: user, posts: posts})
      }
    })
})


app.post('/dash/:id/newPost', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err) {
      console.log(err)
      res.redirect('/dash/' + req.params.id)
    } else {
      newPost(req, res);
    }
  })
})

//===================================
// Login
//========================
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res) =>{
  res.redirect('/dash/' + req.user._id)
});

//===================

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

//===================
app.get('/signup', (req, res) => {
  res.render('signup');
})

app.post('/signup', (req, res) => {
  User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, email: req.body.email, img: req.body.img}), req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('login/signup');
    } else {
      req.login(user, function(err){
        if(err) {
          console.log(err)
        } else {
            return res.redirect('/dash/' + req.user._id)
        }
      });
    }
  })
})


//===================================
app.get('/profile/:id/:collection?', (req, res) => {
  switch (req.params.collection) {
    case undefined:
      getProfile(req, res);
      break;
    case 'Feed':
      getFeed(req, res);
      break;
    case 'Projects':
      getProjects(req, res);
      break;
    case 'Photos':
      getPhotos(req, res);
      break;
  }
})

function getProfile(req, res) {
  User.findById(req.params.id).populate("posts").exec(function(err, profile) {
     if(err) {
       console.log(err)
     } else {
       profile.posts.reverse();
       var editor = (req.user._id.equals(profile.id));
       User.findById(req.user._id, (err, user) => {
         var isFollowing = false;
         user.following.forEach((following) => {
           if (following.id.equals(profile._id)) {
             isFollowing = true;
           }
         })
         res.render('profile', {user: user, profile: profile, editor: editor, isFollowing: isFollowing})
       })
     }
  });
}

function getFeed(req, res) {
  User.findById(req.params.id).populate("posts").exec(function(err, profile) {
     if(err) {
       console.log(err)
     } else {
       res.json({posts: profile.posts})
     }
  });
}

function getProjects(req, res) {
  res.json({html: '<h1>Projects Here</h1>'})
}

function getPhotos(req, res) {
  res.json({html: '<h1>Photos Here</h1>'})
}

app.post('/profile/:id/:action', isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'newPost':
      newPost(req, res);
      break;
    case 'editBio':
      editBio(req, res);
      break;
  }
})


function editBio(req, res) {
  User.findById(req.params.id, (err, profile) => {
    profile.bio = req.body.bio;
    profile.save();
    res.end('{"success" : "Updated Successfully", "status" : 200}');
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
        res.json(post);
      }
    })
   }
  })
}


//=============POST ACTION ROUTES=========================
app.get("/post/:action/:postId", isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'comments':
      getComments(req, res);
      break;
    case 'likes':
      getLikes(req, res);
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


app.post("/post/:action/:postId", isLoggedIn, (req, res) => {
  switch (req.params.action) {
    case 'comment':
      newComment(req, res);
      break;
    case 'like':
      likePost(req, res);
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
        res.json(comment);
      })
    }
  })
}

function createCommentNotification(comment, post, req, res) {
  User.findById(post.user.id, (err, user) => {
    var notification = {
        name: comment.author.name,
        action: "commented",
        target: {
          type: post.type,
          id: post._id
        }
    }
    user.notifications.push(notification);
    user.save();
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
  User.findById(post.user.id, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      var notification = {
          name: req.user.firstName + ' ' + req.user.lastName,
          action: "liked",
          targetType: post.type,
          targetId: post._id
      }
      user.notifications.push(notification);
      user.save();
      }
  })
}

//==============USER ACTION ROUTES====================
app.get("/user/:info/:id?", (req, res) => {
  switch (req.params.info) {
    case "following":
      getFollowing(req, res);
      break;
    case "followers":
      getFollowers(req, res);
      break;
  }
})

function getFollowing(req, res) {
  var id = req.user._id;
  if (req.params.id) {
    id = req.params.id;
  }
  User.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user.following)
    }
  })
}

function getFollowers(req, res) {
  var id = req.user._id;
  if (req.params.id) {
    id = req.params.id;
  }
  User.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user.followers)
    }
  })
}

app.post("/user/:action/:id", isLoggedIn, (req, res) => {
  switch(req.params.action) {
    case "addFollowing":
      addFollowing(req, res);
      break;
  }
})

function addFollowing(req, res) {
  User.findById(req.params.id, (err, following) => {
    if (err) {
      console.log(err);
    } else {
      var newFollowing = {
        id: following._id,
        name: following.firstName + ' ' + following.lastName,
        img: following.img
      };
      User.findById(req.user._id, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          var follower = {
            id: user._id,
            name: user.firstName + ' ' + user.lastName,
            img: user.img
          }
          following.followers.push(follower);
          following.save();
          user.following.push(newFollowing);
          user.save();
          res.end('{"success" : "Followed Successfully", "status" : 200}');
        }
      })
    }
  })
}

//========================================================
app.get('/notifications', isLoggedIn, (req, res) => {
  res.render('notifications')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

http.listen(3000, function() {
  console.log("listening on 3000")
})
