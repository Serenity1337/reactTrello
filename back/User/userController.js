const User = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

let registerUser = (req, res) => {
  let data = req.body
  let user = new User()

  user.username = data.username
  user.password = data.password
  user.email = data.email
  user
    .save()
    .then((createdUser) => {
      res.json(createdUser)
    })
    .catch((e) => {
      res.status(400).json(e)
    })
}
const getAll = async (req, res) => {
  try {
    let users = await User.find()
    res.json(users)
  } catch (e) {
    res.status(400).json(e)
  }
}

// const getSingleUser = async (req, res) => {

//     let id = req.params.id
//     try {
//         let user = await User.findById(id)
//         res.json(user)
//     } catch (e) {
//         res.status(400).jsn(e)
//     }

// }

const login = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    })
    if (!user) {
      res.json('no such user')
      return
    }
    bcrypt.compare(req.body.password, user.password, (err, response) => {
      if (response) {
        let access = 'auth'
        let token = jwt
          .sign(
            {
              _id: user._id.toHexString(),
              access,
            },
            config.password
          )
          .toString()
        user.tokens.push({
          token,
          access,
        })
        user.save().then(() => {
          res.header('x-auth', token).json(user)
        })
      } else {
        res.json('login failed')
      }
    })
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = {
  registerUser,
  login,
  getAll,
}
