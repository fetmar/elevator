const makeResponse = require('../src/utils/makeResponse');
const Http = require('http-status-codes');

describe('makeResponse', ()=>{
  it('should log a message', ()=>{
    expect(makeResponse(Http.OK,{})).toEqual({statusCode:Http.OK,body:{}});
  });

  it('should invalidate an invalid body response', ()=>{
    expect(makeResponse(Http.OK,null).statusCode).toBe(Http.INTERNAL_SERVER_ERROR);
  });

  it('should invalidate an invalid statusCode response', ()=>{
    expect(makeResponse(0,{}).statusCode).toBe(Http.INTERNAL_SERVER_ERROR);
  });

});