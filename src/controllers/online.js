const express = require('express')
const router = express.Router()

const app = express()

app.use('/', require('./online/lobbies'))

module.exports = app

