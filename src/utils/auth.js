const jwt = require('jsonwebtoken')
const config = require('config')
const crypto = require('crypto')
const { genErr } = require('./helpers')

function createToken (payload) {
  return (
    'Bearer ' +
    jwt.sign(payload, config.get('authConfig.tokenSecret'), {
      expiresIn: config.get('authConfig.tokenExpiresIn')
    })
  )
}

function verify (token) {
  try {
    return jwt.verify(token, config.get('authConfig.tokenSecret'), {
      expiresIn: config.get('authConfig.tokenExpiresIn')
    })
  } catch (e) {
    return false
  }
}

function authMiddleware (req, res, next) {
  req.user = verify(req.token)
  if (!req.user) {
    return next(genErr('AUT_02-Access Unauthorized', 'NoAuth', 401))
  }
  next(null)
}

function encodePassword (password) {
  const hash = crypto.createHmac(
    'sha1',
    config.get('authConfig.passwordSecret')
  )
  hash.update(password)
  return hash.digest('hex')
}

module.exports = {
  createToken,
  authMiddleware,
  encodePassword
}
