const config = require('../config/config')
const jwt = require('jsonwebtoken')
const User = require('../User/userModel')

const authenticate = async (req, res, next) => {
  let token = req.header('x-auth')
  let decoded
  try {
    decoded = jwt.verify(token, config.password)
    let user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    })
    if (user) {
      req.user = user
      req.token = token
      next()
    } else {
      res.status(401).json('Not authorized')
    }
  } catch (e) {
    res.status(400).json(e)
  }
}
module.exports = {
  authenticate,
}
