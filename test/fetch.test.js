const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const couchFaker = require('./couchFaker');
const Http = require('http-status-codes');

//const fetch = require('../src/routes/fetch');
//const errs = require('../src/utils/errors');
const app = require('../src/app');


describe('the fetch endpoint', ()=>{

  before(()=>{
    this.couch = require('../src/helpers/couch');
    couchFaker.make(sinon, this.couch);
  });

  after(()=>{
    this.couch = require('../src/helpers/couch');
    couchFaker.restore(this.couch);
  });

  it('should fetch a document', () =>
    request(app).post('/fetch/sweetgroup')
      .send({ids:['one']})
      .then( r =>
        expect(r.statusCode).to.equals(Http.OK)
      )
  );

});
