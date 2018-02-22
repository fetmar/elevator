// This route serves the version document
'use strict';

const Couch = require('../helpers/couch');
const makeResponder = require('../utils/makeResponder');
const makeResponse = require('../utils/makeResponse');
const Errs = require('../utils/errors');

// clean takes a `req` from express and returns valiables.
function clean(req) {
  return {
    groupName: req.params.group
  };
}

// validate the cleaned variables and returns nothing if everything is ok.
function validate(cleaned) {
  return new Promise(function(resolve, reject){
    if (cleaned.groupName === undefined || cleaned.groupName === '') {
      return reject(Errs.MISSING_GROUP_NAME);
    }
    resolve();
  });
}

// work gets the version document from a specified group in couchdb.
function work(groupName) {
  return Couch.getVersion(groupName).then(function (response){
    return makeResponse(response.statusCode, response.body);
  });
}

// route is a request handler for express.
function route(req, res) {

  const responder = makeResponder(res);

  // get everything we need from the request
  const cleaned = clean(req);

  validate(cleaned)
    .then(function(){
      return work(cleaned.groupName);
    }).then(responder)
    .catch(responder);

}

module.exports = {
  clean    : clean,
  validate : validate,
  work     : work,
  route    : route,
};
