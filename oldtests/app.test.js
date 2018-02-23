'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('The root path', () => {
  test('GET method (pixel art proof of life)', (done) => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
