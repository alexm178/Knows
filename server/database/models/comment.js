var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  date: 'Number'

});


module.exports = mongoose.model('Comment', commentSchema);
