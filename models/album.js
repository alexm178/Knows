var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var albumSchema = new mongoose.Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photos: Array
});

albumSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Album', albumSchema);
