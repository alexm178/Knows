//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('dotenv').config()

//your local database url
//27017 is the default mongoDB port

const uri = "mongodb://" + process.env.MLAB_USER + ":" + process.env.MLAB_PASSWORD + "@ds247690.mlab.com:47690/knows"

mongoose.connect(uri).then(
    () => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('Connected to Mongo');

    },
    err => {
         /** handle initial connection error */
         console.log('error connecting to Mongo: ')
         console.log(err);

        }
  );


module.exports = mongoose.connection
