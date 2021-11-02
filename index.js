require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const db = require('./database')
const usersRouter = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.set("view engine", "ejs")

// Session config
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  name: "mrcoffee_sid",
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}))

// ROUTES
app.use('/users', usersRouter)

// add a new Posts for user (written thing)
app.post('/posts', (req, res) => {
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


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))