var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  content: String,
  author:
    {
      id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: 'String',
      img: 'String'
    },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  date: 'Number'

});


module.exports = mongoose.model('Comment', commentSchema);
