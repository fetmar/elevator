// This is meant to be used as middleware for express for simple logging of requests.
const lInfo = require('./logger').lInfo

module.exports = (req, res, next) => {
  lInfo('method', req.method, 'url', req.url)
  next()
}
