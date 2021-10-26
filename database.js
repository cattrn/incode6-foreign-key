const pgp = require('pg-promise')()

const cn = 'postgres://caterinaturnbull:12345678@localhost:5432/foreign_key_test'

const db = pgp(cn)

module.exports = db