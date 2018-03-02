// Retrieves revision numbers for the ids requested
'use strict';

const Couch = require('../helpers/couch');
const makeResponder = require('../utils/makeResponder');
const makeResponse = require('../utils/makeResponse');
const Errs = require('../utils/errors');

// clean returns an object from the request's relevant properties.
function clean(req) {
  return {
    groupName : req.params.group,
    ids       : req.body.ids
  };
}

// validate returns a promise that rejects if there's an error
function validate(cleaned) {
  return new Promise(function(resolve, reject) {
    if (cleaned.groupName === undefined || cleaned.groupName === '') {
      return reject(Errs.MISSING_GROUP_NAME);
    }
    if (cleaned.ids === undefined) {
      return reject(Errs.MISSING_IDS);
    }
    resolve();
  });
}

// work returns the revs for all requested and non-archived assessment ids.
function work(groupName, ids) {

  // get all assessments not archived
  return Couch.getNotArchived(groupName)
    .then((response)=>{
      const dKeys = response.body.rows.map( (row) => row.id.substr(-5) );

      // get all docs available for those assessments
      return Couch.getByDKey(groupName, dKeys);
    }).then((response)=>{
      // make a list of ids that we want to check the revs for
      const ht = {};
      response.body.rows
        .map( (row) => row.id )
        .concat('updates')
        .concat(ids)
        .forEach( one => { ht[one] = true;});
      const allIds = Object.keys(ht);

      // get the revs for all those ids
      return Couch.getAllDocsRevs(groupName, allIds);
    }).then((response)=>{
      // turn them into {id, rev} and remove any undefineds
      return makeResponse(200, response.body.rows
        .map(function(one) {
          if (one.value === undefined) { return; }
          return {
            id  : one.id,
            rev : one.value.rev
          };
        }).filter( (one) => one !== undefined )
      );
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
      return work(cleaned.groupName, cleaned.requestedIds);
    }).then(responder)
    .catch(responder);

}

module.exports = {
  route    : route,
  work     : work,
  validate : validate,
  clean    : clean
};
