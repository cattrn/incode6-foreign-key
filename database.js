const pgp = require('pg-promise')()
const {DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_DATABASE} = process.env

const cn = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

const db = pgp(cn)

module.exports = db