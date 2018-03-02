const request = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');
const Http = require('http-status-codes');

const version = require('../src/routes/version');
const errs = require('../src/utils/errors');

function makeFake (unirest, response) {
  const fake = () => {
    const fake = { end: cb => cb(response) };
    fake.headers = fake.send = () => fake;
    return fake;
  };
  sinon.stub(unirest, 'get').callsFake(fake);
  sinon.stub(unirest, 'post').callsFake(fake);
}

describe('The version endpoint', () => {
  describe('validation', () => {

    it('should invalidate a missing groupName', () =>
      version.validate({}).catch((err)=>
        expect(err).to.equal(errs.MISSING_GROUP_NAME)
      )
    );

    it('should invalidate an empty groupName ', () =>
      version.validate({groupName:''}).catch((err)=>
        expect(err).to.equal(errs.MISSING_GROUP_NAME)
      )
    );

    it('should work with good arguments', () =>
      version.validate({groupName:'sweetgroup'}).then((err)=>
        expect(err).to.be.undefined
      )
    );
  });
});


describe('the route', ()=>{

  it('should get a version', () => {

    this.unirest = require('unirest');
    makeFake(this.unirest, {
      statusCode: Http.OK,
      body: {number:'1','_id':'version'}
    });

    const app = require('../src/app');
    return request(app).get('/version/sweetgroup').then((response) =>
      expect(response.statusCode).to.equal(Http.OK)
    );
  });

  afterEach( ()=>{
    if (this.unirest && this.unirest.get.restore !== undefined) {
      this.unirest.get.restore();
      this.unirest.post.restore();
    }
  });


});
