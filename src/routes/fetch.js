// Handles a request to fetch a set of documents
'use strict';

const Conf = require('../Conf');
const Couch = require('../helpers/couch');
const makeResponder = require('../utils/makeResponder');
const makeResponse = require('../utils/makeResponse');
const Errs = require('../utils/errors');

// clean returns an object containing the requests relevant properties.
function clean(req){
  return {
    groupName: req.params.group,
    ids: req.body.ids
  };
}

// validate returns a promise that rejects on errors.
function validate(cleaned){
  return new Promise(function(resolve, reject){
    if (cleaned.groupName === undefined) {
      return reject(Errs.MISSING_GROUP_NAME);
    }
    if (cleaned.ids === undefined ) {
      return reject(Errs.MISSING_IDS);
    }
    resolve();
  });
}

// work returns a response the requested documents minus the blacklisted.
function work(groupName, ids) {
  // Sanitization
  // first, remove any uri encoding so everything is a regular string. This prevents
  // unauthorized access to e.g. the settings doc by asking for %73ettings.
  // then remove all the sensitive docs.
  const allIds = ids
    .map( (id) => decodeURIComponent(id) )
    .filter( (id) => !~Conf.SENSITIVE_DOCS.indexOf(id) );

  return Couch.getAllDocs(allIds)
    .then(function(response){
      return makeResponse(200, response.body.rows.map( (one) => one.doc ));
    });

}

// route is a request handler for express.
function route(req, res) {
  const responder = makeResponder(res);

  // get everything we need from the request
  const cleaned = clean(req);

  // validate the cleaned variables
  validate(cleaned)
    .then(function(){
      return work(cleaned.groupName, cleaned.ids);
    }).then(responder)
    .catch(responder);

}

module.exports = {
  route    : route,
  clean    : clean,
  validate : validate,
  work     : work
};
