const version = require('../src/routes/version');
const errs = require('../src/utils/errors');
const request = require('supertest');

describe('The version endpoint', () => {
  describe('validation', () => {
    test('missing data', function(done){
      version.validate({}).catch((err)=>{
        expect(err).toBe(errs.MISSING_GROUP_NAME);
        done();
      });
    });

    test('bad data', function(done){
      version.validate({groupName:''}).catch((err)=>{
        expect(err).toBe(errs.MISSING_GROUP_NAME);
        done();
      });
    });

    test('good data', function(done){
      version.validate({groupName:'sweetgroup'}).then((err)=>{
        expect(err).toBe(undefined);
        done();
      });
    });
  });
});


describe('the version endpoint', ()=>{

  it('should get a version', (done) => {

    jest.resetModules();
    jest.mock('unirest', ()=>{
      const response = {
        statusCode: 200,
        body: {number:'1','_id':'version'}
      };
      const mock = { end: (cb) => { return cb(response); } };
      mock.headers = mock.get = mock.post = () => { return mock; };
      return mock;
    });
    const app = require('../src/app');
    request(app).get('/version/sweetgroup').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

});
