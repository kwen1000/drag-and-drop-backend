const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../../models')

const router = express.Router()

router.post('/', (req, res, next) => {
  const useremail = req.body.email
  const userpass = req.body.password

  if (!useremail || !userpass) {
    res.status(401).send({
      message: 'Email or password missing.'
    })
    return
  }

  User.findOne({
    attributes: ['password'],
    where: { email: useremail }
  }).then(item => {
    if (item === null) {
      res.status(401).send({
        message: 'Email not found.'
      })
      return
    }
    bcrypt.compare(userpass, item.password)
      .then(result => {
        if (result === true) {
          jwt.sign(
            { email: useremail },
            process.env.AUTH_SECRET,
            { expiresIn: '1w' },
            (err, token) => {
              if (err) {
                res.status(401).send({
                  message: 'Token creation error.'
                })
              } else {
                res.status(200).send({
                  token: token
                })
              }
            }
          )
        } else {
          res.status(401).send({
            message: 'Incorrect password.'
          })
        }
      })
  }).catch(err => {
    res.status(401).send(err)
  })
})

module.exports = router

