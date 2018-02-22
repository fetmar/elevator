const revs = require('../src/routes/revs');
const request = require('supertest');
const errs = require('../src/utils/errors');
const app = require('../src/app');
jest.mock('../src/helpers/couch');


describe('The revs endpoint', () => {
  describe('validation', () => {
    test('missing group name', function(done){
      revs.validate({}).catch((err)=>{
        expect(err).toBe(errs.MISSING_GROUP_NAME);
        done();
      });
    });

    test('missing ids', function(done){
      revs.validate({groupName:'sweetgroup'}).catch((err)=>{
        expect(err).toBe(errs.MISSING_IDS);
        done();
      });
    });

    test('empty group name', function(done){
      revs.validate({groupName:'',ids:[]}).catch((err)=>{
        expect(err).toBe(errs.MISSING_GROUP_NAME);
        done();
      });
    });

    test('good data', function(done){
      revs.validate({groupName:'sweetgroup', ids:[]}).then((err)=>{
        expect(err).toBe(undefined);
        done();
      });
    });
  });
});


describe('revision', ()=>{

  it('should get the revision of a document', (done) => {
    request(app).post('/revs/sweetgroup')
      .send({ids:['one']})
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });

  });

});
