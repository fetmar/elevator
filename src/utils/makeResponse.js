/** Makes a generic response object for our responder function.
 * Usage:
 *   const r = makeResponse(200, 'Thanks for all the fish.');
 */
'use strict';

const Errs = require('./errors');
const lError = require('./logger').lError;

// returns true when a value is a plain object. not null, not an array, not a function.
function isObjectOrArray(value) {
  return value && typeof value === 'object' && (value.constructor === Object || value.constructor === Array);
}

// validate returns a string of length > 0 if there's an error.
function validate(statusCode, body) {
  let errs = [];
  if ( statusCode === 0 ) {
    errs.push('cannot use status code 0 for response');
  }
  if (!isObjectOrArray(body)) {
    errs.push('response body must be an object or array');
  }
  return errs.join(', ');
}

// makeResponse returns a response object {statusCode:number,body:string}
function makeResponse(statusCode, body) {
  const errs = validate(statusCode, body);
  if (errs.length) {
    lError('function','makeResponse->validate','msg',errs);
    return Errs.INTERNAL_SERVER_ERROR;
  }
  return { statusCode:statusCode, body:body };
}

module.exports = makeResponse;
