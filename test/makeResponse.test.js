const expect = require('chai').expect;

const makeResponse = require('../src/utils/makeResponse');
const Http = require('http-status-codes');

describe('makeResponse', ()=>{
  it('should make a response object', ()=>
    expect(makeResponse(Http.OK,{})).to.deep.equal({statusCode:Http.OK,body:{}})
  );

  it('should invalidate an invalid body response', ()=>
    expect(makeResponse(Http.OK,null).statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
  );

  it('should invalidate an invalid statusCode response', ()=>
    expect(makeResponse(0,{}).statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
  );

});
