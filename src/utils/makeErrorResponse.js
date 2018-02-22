/** Makes a generic response object for our responder function.
 * Usage:
 *   const r = makeResponse(200, 'Thanks for all the fish.');
*/
'use strict';

const Errs = require('./errors');
const lError = require('./logger').lError;

// validate returns a string of length > 0 if there's an error.
function validate(statusCode, body) {
  let errs = [];
  if ( ! (statusCode < 599 && statusCode >= 400) ) {
    errs.push(`cannot use status code ${statusCode} for error response`);
  }
  const respType = typeof body;
  if ( respType !== 'string' ) {
    errs.push(`response body must be a string, not ${respType}`);
  }
  return errs.join(', ');
}

// makeErrorResponse returns a repsonse object with an error message.
function makeErrorResponse(statusCode, msg) {
  const errs = validate(statusCode, msg);
  if (errs.length) {
    lError('function','makeErrorResponse->validate','msg',errs);
    return Errs.INTERNAL_SERVER_ERROR;
  }
  return { statusCode:statusCode, body:{ msg: msg } };
}

module.exports = makeErrorResponse;
