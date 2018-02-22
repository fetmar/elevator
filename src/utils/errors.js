// Contains error responses that are commonly used.
'use strict';

const Http = require('http-status-codes');
const makeErrorResponse = require('./makeErrorResponse');

// errors
module.exports = {

  // Happens when a request comes in with no group name specified.
  MISSING_GROUP_NAME: makeErrorResponse(
    Http.BAD_REQUEST,
    'missing group name'
  ),

  // Happens when there's an error communicating with on couch.
  COUCH_RESPONSE_ERROR: makeErrorResponse(
    Http.INTERNAL_SERVER_ERROR,
    'couldn\'t query database'
  ),

  // Happens when no ids field was supplied in the request body.
  MISSING_IDS: makeErrorResponse(
    Http.BAD_REQUEST,
    'missing ids'
  ),

  // Happens when the programmer messes up and something fails bad.
  INTERNAL_SERVER_ERROR: makeErrorResponse(
    Http.INTERNAL_SERVER_ERROR,
    'someone made a boo boo'
  ),


};
