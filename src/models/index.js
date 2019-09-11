const Sequelize = require('sequelize')
const config = require('config')
const logger = require('../utils/logger')

const sequelize = new Sequelize(config.get('dbUrl'), {
  dialect: 'mysql',
  // Log sql queries only when 'logLevel' config is 'debug'
  logging: sql => logger.log('debug', sql),

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

function _createModel (name) {
  // Convert Pascal case to Snake case
  const tableName = name
    .replace(/\.?([A-Z]+)/g, function (x, y) {
      return '_' + y.toLowerCase()
    })
    .replace(/^_/, '')
  const config = {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
  return sequelize.define(tableName, require(`./${name}`), config)
}


//const ShippingRegion = _createModel('ShippingRegion')
const User = _createModel('User')




User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get())

  delete values.password
  return values
}

module.exports = {
  User,
  sequelize
}
