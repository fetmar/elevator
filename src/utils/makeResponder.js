/** Uses an express res to respond with the provided response object.
 * Usage:
 *   const responder = require('makeResponder')
 *   then().catch(makeResponder(res))
 *
 *   or
 *
 *   const makeResponder = require('makeResponder')
 *   responder = makeResponder(res)
 *   then(responder).catch(responder)
*/

'use strict';

const lInfo = require('./logger').lInfo;
const lError = require('./logger').lError;
const Errs = require('./errors');

// validate returns a responseError and log if there's an error. If there's no error
// validate will return nothing.
function validate(resp) {
  if (resp instanceof Error) {
    lError(
      'name', resp.name,
      'msg', `"${resp.message}"`,
      'stack', `"${resp.stack}"`
    );
    return Errs.INTERNAL_SERVER_ERROR;
  }

  if (resp.statusCode == 0) {
    lError(
      'code', resp.statusCode,
      'err', 'Status code not set.'
    );
    return Errs.INTERNAL_SERVER_ERROR;
  }

  return;
}

// makeResponder returns a closure that will respond appropriately for response objects
// that are made by makeResponse and makeErrorResponse.
function makeResponder(res) {
  return function responder(resp) {
    const err = validate(resp);
    if (err) { resp = err; }

    if (resp.statusCode < 599 && resp.statusCode >= 400) {
      lError('code', resp.statusCode, 'msg', `"${resp.body.msg}"`);
    } else {
      lInfo('code', resp.statusCode);
    }

    // send response
    res.status(resp.statusCode).json(resp.body).end();
  };
}

module.exports = makeResponder;
