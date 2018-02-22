const request = require('supertest');
const Http = require('http-status-codes');

const app = require('../src/app');
jest.mock('../src/helpers/couch');

describe('the fetch endpoint', ()=>{

  it('should fetch a document', (done) => {
    request(app).post('/fetch/sweetgroup')
      .send({ids:['one']})
      .then((response) => {
        expect(response.statusCode).toBe(Http.OK);
        done();
      });

  });

});
