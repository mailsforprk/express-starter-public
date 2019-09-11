const config = require('config')
const { User } = require('../models')
const auth = require('../utils/auth')
const { toPlain } = require('../utils/helpers')

function getUserById (User_id) {
  return User.findByPk(User_id)
}
function registerUser (user) {
 
  return User.create(user) 
}
async function loginUser (userName, password) {
  const users = await User.findAll({
    where: { userName, password: auth.encodePassword(password) }
  }).then(toPlain)
  if (users.length) {
    const user = users[0]
    const accessToken = auth.createToken({
      user_id: user.user_id
    })
    return {
      user,
      accessToken,
      expires_in: config.get('authConfig.tokenExpiresIn')
    }
  } else return false
}

async function updateUser (User_id, toUpdate) {
  const User = await User.findByPk(User_id)
  return User.update(toUpdate)
}

async function deleteUser(userId) {
  const isDeleted = await User.update(
    { isUserActive: 0 },
    {
      where: { userId: userId }
    })
  if (isDeleted[0] === 1) {
    return {
      userId: userId,
      message: "deleted"
    }
  } else return false;
}

async function getUsers(){
  const users = await User.findAll({
    where:{ isUserActive: true}
  })
 return users;
}

module.exports = {
  loginUser,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  getUsers
}
