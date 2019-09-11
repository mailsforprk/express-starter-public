/**
 * Few conventions are followed when writing controllers to generate routes
 * Each controller will have route and schema properties defined.
 * route - This will define the respective route and other route related configs like permission etc.,
 * schema - This will define the JOI schema of 'req' object to validate required properties
 */
const routes = require('express-promise-router')()
const fs = require('fs')
const Joi = require('joi')
const path = require('path')
const { pipe, filter, map, chain, identity, forEach } = require('ramda')
const { genErr } = require('../utils/helpers')

const basename = path.basename(__filename)

pipe(
  filter(file => /^\w+\.js/.test(file)),
  filter(file => file !== basename),
  map(file => path.join(__dirname, file)),
  map(require),
  chain(identity),
  forEach(addRoute)
)(fs.readdirSync(__dirname))

function addRoute (action) {
  const { schema, middlewares } = action
  const { method, path } = action.route

  const actions = [...(middlewares || []), validationMiddleware(schema), action]

  routes[method](path, actions)
}

function validationMiddleware (schema = {}) {
  return (req, res, next) => {
      const value = getValuesForValidation(req)
    const { error } = Joi.validate(value, schema, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map(detail => {
        const message =
          detail.type === 'object.allowUnknown'
            ? 'ERR_01-Field not allowed'
            : detail.message
        return genErr(message, detail.path.join(','))
      })

      return next(errorMessages.length > 1 ? errorMessages : errorMessages[0])
    }
    next(null)
  }
}
/*This code has been written to only validate the query parameters of GET
* request path parameters of DELETE
* request body parameters of other
*/
function getValuesForValidation(req) {
  if (req.method === 'GET') {
    return req.query
  } else if (req.method === 'DELETE') {
    return req.params
  } else {
    return req.body
  }
}



module.exports = { routes }
