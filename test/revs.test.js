const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const couchFaker = require('./couchFaker');
const Http = require('http-status-codes');

const revs = require('../src/routes/revs');
const errs = require('../src/utils/errors');
const app = require('../src/app');

describe('The revs endpoint', () => {

  before(()=>{
    this.couch = require('../src/helpers/couch');
    couchFaker.make(sinon, this.couch);
  });

  after(()=>{
    this.couch = require('../src/helpers/couch');
    couchFaker.restore(this.couch);
  });


  describe('validation', () => {
    it('should invalidate missing group name', () =>
      revs.validate({}).catch( (err) =>
        expect(err).to.equal(errs.MISSING_GROUP_NAME)
      )
    );

    it('should invalidate missing ids', function(){
      revs.validate({groupName:'sweetgroup'}).catch((err)=>
        expect(err).to.equal(errs.MISSING_IDS)
      );
    });

    it('should invalidate empty group name', function(){
      revs.validate({groupName:'',ids:[]}).catch((err)=>
        expect(err).to.equal(errs.MISSING_GROUP_NAME)
      );
    });

    it('should be ok with good data', function(){
      revs.validate({groupName:'sweetgroup', ids:[]}).then((err)=>
        expect(err).to.be.undefined
      );
    });
  });


  describe('the route', ()=>{

    it('should get the revision of a document', () =>
      request(app).post('/revs/sweetgroup')
        .send({ids:['one']})
        .then( r =>
          expect(r.statusCode).to.equal(Http.OK)
        )
    );

  });

});
