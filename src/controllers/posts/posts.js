const express = require('express')
const router = express.Router()

const { Post, User } = require('../../models')

router.get('/', (req, res, next) => {
  if (!req.header('apiKey')) {
    res.status(400).json({
      message: 'API key missing.'
    })
    return
  } else if (req.header('apiKey') !== process.env.API_KEY) {
    res.status(401).json({
      message: 'Unauthorized.'
    })
    return
  }

  Post.findAll({
    // include: [{ model: User, as: 'user' }]
  }).then(data => {
    res.status(200).send(data)
  }).catch(err => {
    res.status(500).send(err)
  })
})

module.exports = router

