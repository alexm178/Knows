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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
  followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
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
  ],
  isFollowing: Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
