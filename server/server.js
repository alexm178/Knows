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
const Post = require('./database/models/post')



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
const http = require('http').Server(app)
http.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})





const io = require('socket.io')(http);

io.on('connection', (socket) => {
	console.log('connect')
	var userId;
	socket.emit('id')
	socket.on('id', (id) => {
		console.log('id')
		userId = id;
		User.findByIdAndUpdate(id, {$set: {socket: socket.id}}).exec()
	});
	socket.on('likeOrComment', (data) => {
		User.findById(data.authorId, 'socket notifications', (err, user) => {
			if (err) {
				console.log(err)
			} else {
				if (user.socket) {
					socket.to(user.socket).emit('notification', data.notification)
					user.notifications.push({notification: data.notification, seen: true})
				} else {
					user.notifications.push({notification: data.notification, seen: false})
				}
				user.save()
			}
		})
	})
	socket.on('follow', (data) => {
		console.log('follow');
		User.findById(data.userId, 'socket notifications', (err, user) => {
			if (err) {
				console.log(err)
			} else {
				if (user.socket) {
					socket.to(user.socket).emit('notification', data.notification)
					user.notifications.push({notification: data.notification, seen: true})
				} else {
					user.notifications.push({notification: data.notification, seen: false})
				}
				user.save()
			}
		})
	})
	socket.on('disconnect', () => {
		console.log('disconnect')
		User.findByIdAndUpdate(userId, {$set: {socket: null}}).exec()
	})
})
