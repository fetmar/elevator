'use strict';

// jshint node:true

const express    = require('express');
const bodyParser = require('body-parser');
const unirest = require('unirest');
const HttpStatus = require('http-status-codes');

// cors middleware for express
const cors = require('cors');

// for cookie parsing in recieved requests
const cookieParser = require('cookie-parser');

const couchAuth = require('./middlewares/couchAuth');

const Settings = require('./Settings');

const verifyRequester = require('./utils/verifyRequester');
const errorHandler    = require('./utils/errorHandler');

const app = express();

const Conf = require('./Conf');

const User = require('./User');
const Group = require('./Group');

app.use(bodyParser.json());    // use json
app.use(cors());               // add cors headers
app.use(cookieParser());       // use cookies
app.use(couchAuth);            // use couchdb cookie authentication

const JSON_OPTS = {
  'Content-Type' : 'application/json',
  'Accept'       : 'application/json'
};


// This should return the version file 
app.get('/version/:group', function(req, res) {
  
  // variables   from url, cookies, and body
  const nameFromCookie = req.couchAuth.body.userCtx.name;
  const groupName  = req.params.group;

  // associated models
  const requestingUser = new User({
    name : nameFromCookie
  });
  
  requestingUser.fetch().then(function(){

    /*
    // Disallow users that aren't members or admins
    var roles = requestingUser.attributes.roles
    if ( roles.filter(function(one){return one.indexOf(groupName) != -1 }).length == 0 ) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({})
        .end();
    }
    */

    return new Promise(function (resolve, reject){
      unirest.get(Conf.calcVersionDocUrl(groupName)).headers(JSON_OPTS)
        .end(function onVersionDocResponse( response ) {
          resolve({
            status: response.status,
            body: response.body
          })
        });	  
    }); // promise

  }).then(function(resp){
    res
      .status(resp.status)
      .json(resp.body)
      .end();
  }).catch(function(resp){
    res
      .status(resp.status)
      .json(resp.body)
      .end();
  });

}); // app.get /version/:group

// byDKey. should return ids and revs for everything in byDKey
app.post('/revs/:group', function(req, res) {
  
  console.log("starting post")

  // variables   from url, cookies, and body
  const nameFromCookie = req.couchAuth.body.userCtx.name;
  const groupName  = req.params.group;

  const requestedIds = req.body.ids || [];
  console.log(requestedIds)
  console.log(req.body)

  // get all assessments not archived
  unirest.get(Conf.calcNotArchivedViewUrl(groupName)).headers(JSON_OPTS)
    .end(function onNotAchivedResponse(response){
      const dKeys = response.body.rows.map( (one) => one.id.substr(-5) )
      console.log("inside notarchived")
      // get all docs available for those assessments
      unirest.post(Conf.calcByDKeyViewUrl(groupName)).headers(JSON_OPTS)
      .send({keys:dKeys})
      .end(function onDKeyViewResponse( response ) {
        console.log("inside viewDKeyResponse")
        // make a list of all the ids we want to check
        const ids = (response.body.rows || []).map( (one) => one.id ).concat("updates").concat(requestedIds)

        // get the revs for all the ids
        unirest.post(Conf.calcAllDocsUrl(groupName)).headers(JSON_OPTS)
          .send({keys:ids})
          .end(function onAllDocsResponse( response ) {
            console.log("inside allDocsResponse")
            const idRevs = (response.body.rows || []).map( 
              function(one) { 
                if (one.value === undefined) { return }
                return {
                  id  : one.id,
                  rev : one.value.rev
                }
            }).filter( (one) => one !== undefined );

            res
              .status(response.status)
              .json(idRevs)
              .end();
          });
      });	  
  });

  
}); // app.get /revs/:group



// Returns any docs requested
app.post('/fetch/:group', function(req, res) {
  
  // variables   from url, cookies, and body
  const nameFromCookie = req.couchAuth.body.userCtx.name;
  const groupName  = req.params.group;

  // associated models
  const requestingUser = new User({
    name : nameFromCookie
  });

  requestingUser.fetch().then(function(){

    /*
    // Disallow users that aren't members or admins
    var roles = requestingUser.attributes.roles
    if ( roles.filter(function(one){return one.indexOf(groupName) != -1 }).length == 0 ) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({})
        .end();
    }
    */

    const docIds = req.body.ids || []

    return new Promise(function (resolve, reject){
      unirest.post(Conf.calcAllDocsUrl(groupName) + "?include_docs=true").headers(JSON_OPTS)
        .send({keys:docIds})
        .end(function onAllDocsResponse( response ) {
          const allDocsResponse = response.body.rows.map( (one) => one.doc )
          resolve({
            status: response.status,
            body: allDocsResponse
          })
        });	  
    }); // promise

  }).then(function(resp){
    res
      .status(resp.status)
      .json(resp.body)
      .end();
  }).catch(function(resp){
    res
      .status(resp.status)
      .json(resp.body)
      .end();
  });

}); // app.get /update/:group


// kick it off
const server = app.listen(Settings.T_ELEVATOR_PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Decompressor: http://%s:%s', host, port);
});
