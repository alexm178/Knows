const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dbConnection = require('./database')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express()
const PORT = 3001
const User = require('./database/models/user')



// MIDDLEWARE
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())



// SESSIONS
app.use(
	session({
		secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
		resave: false, //required
		saveUninitialized: false, //required
    store: new MongoStore({
      mongooseConnection: dbConnection
    })
	})
)

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
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




// routes
const index = require('./routes/index')
const user = require('./routes/user')
const post = require('./routes/post')

app.use('/', index)
app.use('/user', user)
app.use('/post', post)


// Starting Server
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
