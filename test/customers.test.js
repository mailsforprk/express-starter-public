const request = require('supertest')
const Op = require('sequelize').Op
const app = require('../src/app')
const { Customer } = require('../src/models')

beforeAll(async () => {
  await Customer.bulkCreate([
    {
      customer_id: 1001,
      name: 'User 1001',
      email: 'user1001@elango.dev',
      password: 'password'
    },
    {
      customer_id: 1002,
      name: 'User 1002',
      email: 'user1002@elango.dev',
      password: 'password'
    },
    {
      customer_id: 1003,
      name: 'User 1003',
      email: 'user1003@elango.dev',
      password: 'password'
    },
    {
      customer_id: 1004,
      name: 'User 1004',
      email: 'user1004@elango.dev',
      password: 'password'
    },
    {
      customer_id: 1005,
      name: 'User 1005',
      email: 'user1005@elango.dev',
      password: 'password'
    }
  ])
})
describe('GET /customer', function () {
  const baseUrl = '/customer'
  let accessToken = ''
  beforeAll(async () => {
    const res = await request(app)
      .post('/customers/login')
      .send({
        email: 'user1001@elango.dev',
        password: 'password'
      })
    accessToken = res.body.accessToken
  })
  it('should return 401 error when invalid accessToken is sent', async () => {
    const res = await request(app).get(baseUrl)
    expect(res.status).toBe(401)
    expect(res.body.code).toBe('AUT_02')
    expect(res.body.message).toBe('Access Unauthorized')
  })
  it('should return valid customer data with valid accessToken', async () => {
    const res = await request(app)
      .get(baseUrl)
      .set('Authorization', accessToken)
    expect(res.status).toBe(200)
    expect(res.body.customer_id).toBe(1001)
    expect(res.body).not.toHaveProperty('password')
    expect(res.body).toMatchSnapshot()
  })
})
describe('POST /customers', function () {
  const baseUrl = '/customers'
  it('should register new customer and return login details of new customer', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'user1@elango.dev',
        password: 'password',
        name: 'user1'
      })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
    expect(res.body.customer).toBeDefined()
    expect(res.body.customer.email).toBe('user1@elango.dev')
  })
  it('should send USR_04 if email already exist', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'user1001@elango.dev',
        password: 'password',
        name: 'user1'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_04')
    expect(res.body).toMatchSnapshot()
  })
  it('should send USR_02 if password is missing', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'user1@elango.dev',
        name: 'user1'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_02')
    expect(res.body.field).toBe('password')
  })
  it('should send USR_02 if email is missing', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        password: 'password',
        name: 'user1'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_02')
    expect(res.body.field).toBe('email')
  })
  it('should send USR_02 if name is missing', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        password: 'password',
        email: 'user1@elango.dev'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_02')
    expect(res.body.field).toBe('name')
  })
  it('should send USR_03 if email is invalid', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'invalidEmail',
        password: 'password',
        name: 'user1'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_03')
  })
})
describe('PUT /customer', function () {
  const baseUrl = '/customer'
  let accessToken = ''
  beforeAll(async () => {
    const res = await request(app)
      .post('/customers/login')
      .send({
        email: 'user1002@elango.dev',
        password: 'password'
      })
    accessToken = res.body.accessToken
  })
  it('should update customer details', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send({
        email: 'user1002@elango.dev',
        name: 'user1002',
        password: 'password',
        day_phone: '111111',
        eve_phone: '111111',
        mob_phone: '111111'
      })
    expect(res.status).toBe(200)
    expect(res.body.day_phone).toBe('111111')
    expect(res.body)
  })
  it('should return USR_02 when a required field is missing', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send()
    expect(res.status).toBe(400)
    expect(res.body.length).toBe(2)
    res.body.forEach(r => {
      expect(r.code).toBe('USR_02')
    })
  })
  it('should return USR_03 when email is invalid', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send({
        email: 'invalidEmail',
        name: 'user1002'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_03')
  })
})
describe('PUT /customers/address', function () {
  const baseUrl = '/customers/address'
  let accessToken = ''
  beforeAll(async () => {
    const res = await request(app)
      .post('/customers/login')
      .send({
        email: 'user1003@elango.dev',
        password: 'password'
      })
    accessToken = res.body.accessToken
  })
  it('should update customer address', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send({
        address_1: 'address 1',
        address_2: 'address 2',
        city: 'city',
        region: 'region',
        postal_code: '11111',
        country: 'country',
        shipping_region_id: 1
      })

    expect(res.status).toBe(200)
    expect(res.body.customer_id).toBe(1003)
    expect(res.body.address_1).toBe('address 1')
  })
  it('should return USR_02 when a required field is missing', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send()
    expect(res.status).toBe(400)
    expect(res.body.length).toBe(6)
    res.body.forEach(r => {
      expect(r.code).toBe('USR_02')
    })
  })
})
describe('PUT /customers/creditCard', function () {
  const baseUrl = '/customers/creditCard'
  let accessToken = ''
  beforeAll(async () => {
    const res = await request(app)
      .post('/customers/login')
      .send({
        email: 'user1004@elango.dev',
        password: 'password'
      })
    accessToken = res.body.accessToken
  })
  it('should update credit card of the customer', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send({
        credit_card: '1111222233334444'
      })
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.customer_id).toBe(1004)
    expect(res.body.credit_card).toBe('1111222233334444')
  })
  it('should return USR_02 error if credit_card is not present', async () => {
    const res = await request(app)
      .put(baseUrl)
      .set('Authorization', accessToken)
      .send({})
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_02')
  })
})
describe('POST /customers/login', function () {
  const baseUrl = '/customers/login'
  it('should return customer data with bearer auth token', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'user1001@elango.dev',
        password: 'password'
      })
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveProperty('customer')
    expect(res.body.customer).not.toHaveProperty('password')
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body.customer).toMatchSnapshot()
  })
  it('should return USR_02 error if email or password is not present', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({})
    expect(res.status).toBe(400)
    expect(res.body instanceof Array).toBe(true)
    expect(res.body[0].code).toBe('USR_02')
  })
  it('should return USR_01 error if email or password is invalid', async () => {
    const res = await request(app)
      .post(baseUrl)
      .send({
        email: 'user@elango.dev',
        password: 'password'
      })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe('USR_01')
  })
})

afterAll(async () => {
  await Customer.destroy({
    where: {
      customer_id: {
        [Op.in]: [1001, 1002, 1003, 1004, 1005]
      }
    }
  })
})
