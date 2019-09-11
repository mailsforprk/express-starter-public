/**
 * Convert sequelize response to plain json
 * @param response Sequelize response
 * @returns {any}
 */
function toPlain (response) {
  return JSON.parse(JSON.stringify(response))
}

/**
 * Converts to sequelize pagination friendly object
 * @returns {{offset: number, limit: number, order: *}}
 */
function toPagination (limit, page) {
  return {
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit)
  }
}

/**
 * Generate error message in predefined format
 * @param content - "COD_01-Error message to be displayed" - Should be in this format
 * @param field - The field responsible for this error
 * @param status - HTTP Status code
 * @returns {{result: {code: string, field: *, message: string, status: number}, stack: *}}
 */
function genErr (content, field, status = 400) {
  const [code, message] = content.split('-')
  return {
    stack: content,
    result: {
      status,
      code,
      message,
      field
    }
  }
}

module.exports = {
  toPlain,
  toPagination,
  genErr
}
