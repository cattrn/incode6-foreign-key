const express = require('express')
const router = express.Router()
const {redirectToLogin} = require('../middleware/redirect')

router.get('/', redirectToLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      res.send(err.message)
    } else {
      console.log(req.session)
      res.clearCookie('mrcoffee_sid')
      res.redirect('/users/login')
    }
  })
})

module.exports = router