var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
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
  tags: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: 'String'
  }
],
  commentCount: Number,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  likes: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: 'String',
      img: 'String'
    }
  ],
  date: 'Number',
  type: 'String',

});


module.exports = mongoose.model('Post', postSchema);
