if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const app = require('express')()
const bodyParser = require('body-parser')
const config = require('config')
const morgan = require('morgan')
const bearerToken = require('express-bearer-token')
const cors = require('cors')

const { routes } = require('./controllers')
const logger = require('./utils/logger')
const { genErr } = require('./utils/helpers')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(bearerToken())
app.use(cors())

app.use(`/`, routes)

// Invalid path error handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Invalid path. Please fix the URL and try again.'
  })
})

// Error handler
app.use((err, req, res, next) => {
  const stack = err instanceof Array ? err.map(e => e.stack) : err.stack
  logger.error(stack)

  const result =
    err instanceof Array
      ? err.map(e => e.result)
      : err.result || genErr('ERR_01-Server error', undefined, 500).result
  const status = result instanceof Array ? 400 : result.status

  res.status(status).json(result)
})

module.exports = app.listen(config.port, () =>
  console.log('Example app listening on port ' + config.port)
)
