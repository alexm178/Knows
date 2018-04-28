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


// var path = require('path');
// var multer = require('multer');
// var multerS3 = require('multer-s3');
//
// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('config.json');
// var s3 = new AWS.S3( { params: {Bucket: 'knows'} } )








mongoose.connect("mongodb://localhost/knows");
var User = require('./models/user')
var Post = require('./models/post')



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
app.get('/dash/:id', isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate('posts').then((user) => {
      if (req.user.follows.length > 0) {
        var posts = user.posts;
        user.follows.forEach((followId) => {
          User.findById(followId).populate('posts').then((follow) => {
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
        res.render('dash', {user: user, posts: []})
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
app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', passport.authenticate('local', {
  failureRedirect: '/',
}), (req, res) =>{
  res.redirect('/dash/' + req.user._id)
});

//===================

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

//===================
app.get('/signup', (req, res) => {
  res.render('login/signup');
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
       console.log(profile);
       profile.posts.reverse();
       var editor = (req.user._id.equals(profile.id));
       User.findById(req.user._id, (err, user) => {
         var follows = false;
         user.follows.forEach((follow) => {
           if (follow.equals(profile.id)) {
             follows = true;
           }
         })
         res.render('profile', {user: user, profile: profile, editor: editor, follows: follows})
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

app.post('/profile/:id/:action', (req, res) => {
  switch (req.params.action) {
    case 'follow':
      addFollow(req, res);
      break;
    case 'newPost':
      newPost(req, res);
      break;
    case 'editBio':
      editBio(req, res);
      break;
  }
})



function addFollow(req, res) {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      user.follows.push(req.params.id);
      user.save();
      User.findById(req.params.id, (err, profile) => {
        profile.followers.push(req.user._id)
        profile.save();
        res.end('{"success" : "Updated Successfully", "status" : 200}');
      })
    }
  })
}

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
        post.save();
        profile.posts.push(post);
        profile.save();
        res.json(post);
      }
    })
   }
  })
}
//======================================
app.get('/notifications', isLoggedIn, (req, res) => {
  res.render('notifications')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

app.listen(3000, () => {
  console.log('listening 300')
})
