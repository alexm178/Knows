const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('passport')

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({authenticated: true, user: req.user})
})

router.post('/logout', (req, res) => {
  req.logout()
  res.json({authenticated: false, user: null})
})

router.get('/auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({authenticated: true, user: req.user})
  } else {
    res.json({authenticated: false, user: null})
  }
})

module.exports = router
