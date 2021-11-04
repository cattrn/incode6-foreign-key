const express = require('express')
const router = express.Router()

// add a new Posts for user (written thing)
router.post('/', (req, res) => {
  const { user_id, title, content } = req.body
  // please validate!

  db.none('INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3);', [user_id, title, content])
  .then(() => {
    res.send(req.body)
  })
  .catch((err) => {
    console.log(err)
    res.send(err.message)
  })
})

module.exports = router