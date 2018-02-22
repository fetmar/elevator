// The Couch helper handles the REST calls to Tangerine specific Couch views.
'use strict';

const Conf = require('../Conf');
const unirest = require('unirest');
const lError = require('../utils/logger').lError;
const Errs = require('../utils/errors');

const JSON_OPTS = {
  'Content-Type' : 'application/json',
  'Accept'       : 'application/json'
};

module.exports = {

  // get all assessments not archived.
  getNotArchived: function getNotArchived(groupName) {
    return new Promise((resolve, reject)=>{
      if (groupName === undefined || groupName === '') {
        lError('function', 'getNotArchived', 'msg', 'no group name');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      unirest.get(Conf.calcNotArchivedViewUrl(groupName)).headers(JSON_OPTS)
        .end((response)=>{
          if (response.error) {
            lError('function', 'getNotArchived>callback', 'response', response.error);
            return reject(Errs.COUCH_RESPONSE_ERROR);
          }
          resolve(response);
        });
    });
  },

  // get the revs for all the ids
  getAllDocsRevs: function getAllDocsRevs(groupName, ids) {
    return ( new Promise((resolve, reject)=>{
      if (groupName === undefined || groupName === '') {
        lError('function', 'getAllDocsRevs', 'msg', 'no group name');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      if (ids === undefined) {
        lError('function', 'getAllDocs', 'msg', 'no ids');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      unirest.post(Conf.calcAllDocsUrl(groupName)).headers(Conf.JSON_OPTS)
        .send({keys:ids})
        .end(( response ) => {
          if (response.error) {
            lError('function', 'getAllDocsRevs>callback', 'response', response.error);
            return reject(Errs.COUCH_RESPONSE_ERROR);
          }
          resolve(response);
        });
    }));
  },

  // get the docs for all the ids
  getAllDocs: function getAllDocs(groupName, ids) {
    return ( new Promise((resolve, reject)=>{
      if (groupName === undefined || groupName === '') {
        lError('function', 'getAllDocs', 'msg', 'no group name');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      if (ids === undefined) {
        lError('function', 'getAllDocs', 'msg', 'no ids');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      unirest.post(Conf.calcAllDocsUrl(groupName) + '?include_docs=true').headers(Conf.JSON_OPTS)
        .send({keys:ids})
        .end(( response ) => {
          if (response.error) {
            lError('function', 'getAllDocs>callback', 'response', response.error);
            return reject(Errs.COUCH_RESPONSE_ERROR);
          }
          resolve(response);
        });
    }));
  },


  // get the version document.
  getVersion: function getVersion(groupName) {
    return new Promise((resolve, reject) => {
      if (groupName === undefined || groupName === '') {
        lError('function', 'getVersion', 'msg', 'no group name');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }

      unirest.get(Conf.calcVersionDocUrl(groupName)).headers(JSON_OPTS)
        .end((response)=>{
          if (response.error) {
            lError('function', 'getVersion>callback','response', response.error);
            return reject(Errs.COUCH_RESPONSE_ERROR);
          }
          resolve(response);
        });
    });
  },

  // get documents associated with an assessment by the dkey.
  getByDKey: function getByDKey(groupName, dKeys) {
    return (new Promise((resolve, reject)=>{
      if (groupName === undefined || groupName === '') {
        lError('function', 'getVersion', 'msg', 'no group name');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }
      if (dKeys === undefined) {
        lError('function', 'getAllDocs', 'msg', 'no ids');
        return reject(Errs.INTERNAL_SERVER_ERROR);
      }

      unirest.post(Conf.calcByDKeyViewUrl(groupName)).headers(Conf.JSON_OPTS)
        .send({keys:dKeys})
        .end(( response ) => {
          if (response.error) {
            lError('function', 'getByDKey>callback','response', response.error);
            return reject(Errs.COUCH_RESPONSE_ERROR);
          }
          resolve(response);
        });
    }));
  }
};
