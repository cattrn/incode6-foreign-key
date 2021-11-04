const express = require('express')
const router = express.Router()
const {redirectToLogin} = require('../middleware/redirect')

router.get('/', redirectToLogin, (req, res) => {
  res.render('pages/home')
})

module.exports = router