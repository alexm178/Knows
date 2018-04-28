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
  user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: 'String'
  },
  date: 'Number'

});


module.exports = mongoose.model('Post', postSchema);
