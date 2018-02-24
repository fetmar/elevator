'use strict';

const request = require('supertest');
const app = require('../src/app');
const Http = require('http-status-codes');
const expect = require('chai').expect;

describe('The root path', () => {
  it('should get the root path for the pixel art proof of life', () =>
    request(app).get('/').then((response) =>
      expect(response.statusCode).to.equal(Http.OK)
    )
  );
});
