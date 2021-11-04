require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('express-flash')
const db = require('./database')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const homeRouter = require('./routes/home')
const logoutRouter = require('./routes/logout')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.set("view engine", "ejs")

// session config
app.use(session({
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  name: "mrcoffee_sid",
  saveUninitialized: false,
  resave: false,
  secret: process.env.SESSION_SECRET
}))

app.use(flash())


// ROUTES
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/logout', logoutRouter)
app.use('/', homeRouter)


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))