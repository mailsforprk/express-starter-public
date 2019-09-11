const Sequelize = require('sequelize')
const { encodePassword } = require('../utils/auth')

module.exports = {
  userId: { type: Sequelize.INTEGER, primaryKey: true, field: 'user_id' },
  userName: { type: Sequelize.STRING(50), allowNull: true, field: 'user_name' },
  firstname: { type: Sequelize.STRING(50), allowNull: true },
  lastname: { type: Sequelize.STRING(50), allowNull: true },
  email: { type: Sequelize.STRING(100), allowNull: true, uniqueKey: true },
  password: {
    type: Sequelize.STRING(50),
    allowNull: false,
    set(password) {
      return this.setDataValue('password', encodePassword(password))
    }
  },
  role: Sequelize.STRING(100),
  mobile: { type: Sequelize.STRING(100) },
  age: Sequelize.INTEGER,
  category: Sequelize.STRING,
  jwt: Sequelize.VIRTUAL,
  isUserActive: {
    type: Sequelize.BOOLEAN,
    field: 'active',
    set(isUserActive) {
      return this.setDataValue('isUserActive', (isUserActive) ? 1 : 0);
    },
    get() {
      return (this.getDataValue('isUserActive') == 1 ? true : false)
    }
  }
}
