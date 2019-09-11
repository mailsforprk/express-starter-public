const app = require('../src/app')
const {
  sequelize,
  ShoppingCart,
  Customer,
  Orders,
  OrderDetail,
  Review
} = require('../src/models')

module.exports = async () => {
  await ShoppingCart.destroy({ truncate: true })
  await Customer.destroy({ truncate: true })
  await OrderDetail.destroy({ truncate: true })
  await Orders.destroy({ truncate: true })
  await Review.destroy({ truncate: true })

  // Closing the DB connection allows Jest to exit successfully.
  sequelize.close()
  app.close()
}
