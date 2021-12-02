const express = require('express')
const router = express.Router()

const { User } = require('../../models')

const auth_header = 'Authorization'
const auth_prefix_bearer = 'Bearer'
const auth_prefix_jwt = 'JWT'

router.get('/', (req, res, next) => {
  const header = req.header(auth_header)

  if (!header) {
    return res.status(400).json({
      message: 'Missing auth credentials.'
    })
  } else if (!req.body.username) {
    return res.status(400).send({
      message: 'Missing username in JSON body.'
    })
  }

  let headerSplit = header.split(' ')

  if (headerSplit[0] == auth_prefix_jwt) {
    User.findOne({ 
      where: { access_token: headerSplit[1] } 
    }).then(data => {
      if (!data) {
        res.status(400).send({ message: 'Invalid access token.' })
      } else {
        User.findAll({
          where: { username: req.body.username },
          attributes: [ 'email', 'username' ]
        }).then(results => {
          res.status(200).send(results)
        }).catch(err => {
          res.status(500).send(err)
        })
      }
    }).catch(err => {
      res.status(500).send(err)
    })
  } else {
    res.status(400).send({
      message: 'Invalid auth header.'
    })
  }
})

router.post('/me', (req, res, next) => {
  const header = req.header(auth_header)

  if (!header) {
    return res.status(400).send({
      message: 'Missing auth credentials.'
    })
  }

  const headerSplit = header.split(' ')

  User.findOne({
    where: { access_token: headerSplit[1] },
    attributes: [ 'email', 'username' ]
  }).then(data => {
    if (!data) {
      res.status(400).send({ message: 'Invalid access token.' })
    } else {
      res.status(200).send(data)
    }
  })
})

module.exports = router

