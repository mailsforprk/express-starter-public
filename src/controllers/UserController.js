const Joi = require('joi')
const UserService = require('../services/UserService')
const { genErr } = require('../utils/helpers')
const { authMiddleware } = require('../utils/auth')
const v = require('../utils/validations')

async function registerUserAction (req, res, next) {
  try {
    await UserService.registerUser(req.body)
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.json({message:"existing"})
    else return next(e)
  }
  const User = await UserService.loginUser(
    req.body.userName,
    req.body.password
  )
  res.json({message:"success",...User})
}
registerUserAction.route = {
  method: 'post',
  path: '/api/user'
}
registerUserAction.schema = {
email: Joi.string()
.email()
.required()
.error(err => {
return err[0].context.value === 'invalidEmail' ? v.email : v.required
}),
password: Joi.string()
.required()
.error(() => v.required),
firstname: Joi.string(),
lastname: Joi.string(),
address_1: Joi.string(),
address_2: Joi.string(),
city: Joi.string(),
mobile: Joi.string(),
age: Joi.number(),
jwt: Joi.string(),
userName: Joi.string(),
role: Joi.string(),
category: Joi.string().allow(null).allow(""),
isUserActive: Joi.boolean()
}

// delete function for user
async function deleteUserAction (req, res) {
  const response = await UserService.deleteUser(    
    req.params.userId
  )
  res.json(response)
}
deleteUserAction.route = {
  method: 'delete',
  path: '/user/:userId'
  
}
 deleteUserAction.schema = {
  userId: Joi.number()
  .integer()
       .required()
        .error(err => {
          return err[0] && err[0].type === 'number.base'
            ? 'USR_09-The userId is not a number'
            : v.required
        })
}  
deleteUserAction.middlewares = [authMiddleware]

// login a user
async function loginUserAction (req, res, next) {
  const { userName, password } = req.body
  const User = await UserService.loginUser(userName, password)
  if (!User) return next(genErr(v.invalidLogin))
  res.json(User)
}
loginUserAction.route = {
  method: 'post',
  path: '/api/sign-in'
}
loginUserAction.schema = {
  userName: Joi.string()
    .required()
    .error(() => v.required),
  password: Joi.string()
    .required()
    .error(() => v.required)
}

// ------- start of fetch user list-----
async function getUsersAction(req, res) {
const users =await UserService.getUsers()
res.json({ responseObject : users, status : "success"})
}
getUsersAction.route ={
  method :'get',
  path:'/api/users'
}
getUsersAction.middlewares = [authMiddleware]
// ------- end of fetch user list-----
async function getUserAction (req, res) {
  const User = await UserService.getUserById(    
    req.user.user_id
  )
  res.json(User)
}
getUserAction.route = {
  method: 'get',
  path: '/User'
}
getUserAction.middlewares = [authMiddleware]

async function updateUserAction (req, res) {
  const User = await UserService.updateUser(
    req.User.User_id,
    req.body
  )
  res.json(User)
}
updateUserAction.route = {
  method: 'put',
  path: '/User'
}
updateUserAction.schema = {
  email: Joi.string()
    .email()
    .required()
    .error(err => {
      return err[0].context.value === 'invalidEmail' ? v.email : v.required
    }),
  password: Joi.string(),
  name: Joi.string()
    .required()
    .error(() => v.required),
  day_phone: Joi.string(),
  eve_phone: Joi.string(),
  mob_phone: Joi.string()
}
updateUserAction.middlewares = [authMiddleware]

async function updateUserAddressAction (req, res) {
  const User = await UserService.updateUser(
    req.User.User_id,
    req.body
  )
  res.json(User)
}
updateUserAddressAction.route = {
  method: 'put',
  path: '/Users/address'
}
updateUserAddressAction.schema = {
  address_1: Joi.string()
    .required()
    .error(() => v.required),
  address_2: Joi.string(),
  city: Joi.string()
    .required()
    .error(() => v.required),
  region: Joi.string()
    .required()
    .error(() => v.required),
  postal_code: Joi.string()
    .required()
    .error(() => v.required),
  country: Joi.string()
    .required()
    .error(() => v.required),
  shipping_region_id: Joi.number()
    .integer()
    .required()
    .error(err => {
      return err[0] && err[0].type === 'number.base'
        ? 'USR_09-The Shipping ID is not a number'
        : v.required
    })
}
updateUserAddressAction.middlewares = [authMiddleware]

async function updateUserCreditCardAction (req, res) {
  const User = await UserService.updateUser(
    req.User.User_id,
    req.body
  )
  res.json(User)
}
updateUserCreditCardAction.route = {
  method: 'put',
  path: '/Users/creditCard'
}
updateUserCreditCardAction.schema = {
  credit_card: Joi.string()
    .creditCard()
    .required()
    .error(() => {
      return v.required
    })
}
updateUserCreditCardAction.middlewares = [authMiddleware]



module.exports = [
  loginUserAction,
  getUserAction,
  registerUserAction,
  updateUserAction,
  updateUserAddressAction,
  updateUserCreditCardAction,
  deleteUserAction,
  getUsersAction
]
