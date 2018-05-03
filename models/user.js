var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  // zip: Number,
  knows: Array,
  img: String,
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
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
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
  notifications: [
    {
      name: String,
      action: String,
      targetType: String,
      targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    }
  ],
  socket: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
