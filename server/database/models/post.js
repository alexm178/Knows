var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commentCount: Number,
  likeCount: Number,
  likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
  ],
  liked: Boolean,
  date: Number,
  type: String,
});


module.exports = mongoose.model('Post', postSchema);
