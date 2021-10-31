const express = require('express')
const router = express.Router()

const app = express()

app.use('/register', require('./auth/register'))
app.use('/login', require('./auth/login'))
app.use('/users', require('./auth/users'))
app.use('/posts', require('./auth/posts'))

module.exports = app

