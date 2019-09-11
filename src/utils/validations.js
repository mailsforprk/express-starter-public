const required = 'USR_02-The field(s) are/is required.',
  number = field => `USR_09-The ${field} is not a number`

module.exports = {
  invalidLogin: 'USR_01-Email or Password is invalid',
  required,
  email: 'USR_03-The email is invalid.',
  emailExists: 'USR_04-The email already exists.',
  number,
  requiredNumber: (err, field) =>
    err[0] && err[0].type === 'number.base' ? number(field) : required
}
