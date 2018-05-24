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

var ioModule = require('./socket')

io.on('connect', function(socket){
 socket.on('id', function(data) {
   setTimeout(function(date) {
     ioModule.id(data, socket)
   }, 2000);
 });
 socket.on('like', function(data) {
   setTimeout(function(date) {
     ioModule.like(data, socket)
   }, 2000);
 });
 socket.on('comment', function(data) {
   setTimeout(function(date) {
     ioModule.comment(data, socket)
   }, 2000);
 })
 socket.on('post', function(data) {
   setTimeout(function(date) {
     ioModule.post(data, socket)
   }, 2000);
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


var dashRouter = require('./routes/dash.js');
    indexRouter = require('./routes/index.js');
    profileRouter = require('./routes/profile.js');
    userRouter = require('./routes/user.js');
    postRouter = require('./routes/post.js');

app.use(dashRouter);
app.use(indexRouter);
app.use(profileRouter);
app.use(userRouter);
app.use(postRouter);


http.listen(3000, function() {
  console.log("listening on 3000")
})
