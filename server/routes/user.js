const express = require('express')
const router = express.Router()
const User = require('../database/models/user')

router.post('/', (req, res) => {
    // ADD VALIDATION
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: "Sorry, the email address " + req.body.email + " is already in use"
            })
        }
        else {

            User.register(new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, img: "https://s3.us-east-2.amazonaws.com/knows/avatar.png"}), req.body.password)
            .then(
              user => {
                res.json({authenticated: true, user: user})
              }
            )
            .catch(err => {return res.json(err)})
        }
    })
})



module.exports = router
