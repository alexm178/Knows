var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  username: String,
  img: String,
  cover: String,
  zip: Number,
  knows: Array,
  bio: String,
  following: [
    {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
      name: String,
      img: String
    }
  ],
  followers: [
    {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
      name: String,
      img: String
    }
  ],
  notifications: [{
    notification: {},
    seen: Boolean
  }],
  socket: String,
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    }
  ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
