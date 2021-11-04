const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../database')
const { redirectToHome } = require('../middleware/redirect')
const router = express.Router()

const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

const passwordRegex = /^[^<>]{6,}$/

const isValid = (value, regex) => {
  return regex.test(value)
}

const cleanEmail = (email) => {
  return email ? email.toLowerCase().trim() : ""
}

// display register form
router.get('/register', (req, res) => res.render('pages/register'))

// @path    '/users/register'
// @desc    register a new user
// @access  public
router.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body
  const cleanedEmail = cleanEmail(email)

  // 1. validate! - yup and joi are decent validation packages

  if (!email || !password || !confirmPassword ) return res.send("Please enter all fields")
  if (!isValid(cleanedEmail, emailRegex)) return res.send("Email not valid")
  if (!isValid(password, passwordRegex)) return res.send("Password must be 6 characters or more")
  if (password !== confirmPassword) return res.send("Passwords don't match")

  // 2. check if email already exists

  db.oneOrNone('SELECT email FROM users WHERE email = $1;', [cleanedEmail])
  .then((user) => {
    if (user) return res.send("User already exists")

    // 3. if all valid and email doesn't already exist, hash password and insert into db

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    db.none('INSERT INTO users (email, password) VALUES ($1, $2);', [cleanedEmail, hash])
    .then(() => {
      res.redirect('/users/login')
      // TODO: add success message
    })
    .catch((err) => {
      // error inserting into db
      console.log(err)
      res.send(err.message)
    })
  })
  .catch((err) => {
    // error checking whether the email exists
    console.log(err)
    res.send(err.message)
  })
})



// @path    '/users/login'
// @desc    login a user
// @access  public
router.get('/login', redirectToHome, (req, res) => res.render('pages/login'))

// login a user
router.post('/login', redirectToHome, (req, res) => {
  const { email, password } = req. body
  const cleanedEmail = cleanEmail(email)

  // 1. validate
  if (!email || !password) return res.send("Please enter both email and password")
  if (!isValid(cleanedEmail, emailRegex)) return res.send("Email is not valid")
  if (!isValid(password, passwordRegex)) return res.send("Password is not valid")

  // 2. does user exist?
  db.oneOrNone('SELECT * FROM users WHERE email = $1;', [cleanedEmail])
  .then((user) => {
    if (!user) return res.send("Credentials are not correct")

    // 3. if so, is password correct?
    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) return res.send("Credentials are not correct")

    // 4. user is valid!!! do something to track them
    // >>>>>>>>>>>>>>>>>>>
    req.session.userId = user.id
    console.log(req.session)
    
    res.redirect('/')

    // User ID can be accessed on any route via req.session.userId
  })
  .catch((err) => {
    // error checking db for existing email
    console.log(err)
    res.send(err.message)
  })
})


module.exports = router
