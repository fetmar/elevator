const sinon = require('sinon');
const expect = require('chai').expect;
const makeResponder = require('../src/utils/makeResponder');
const makeResponse = require('../src/utils/makeResponse');
const makeErrorResponse = require('../src/utils/makeResponse');

describe('makeResponder', ()=>{

  it('make responder', ()=>{
    const res = sinon.spy();
    const responder = makeResponder(res);
    return expect(responder).to.not.be.undefined;
  });

  it('use responder for successful response', ()=>{
    const spy = sinon.spy();
    const resMock = {};
    resMock.status = resMock.json = resMock.end = ()=>{spy(); return resMock;};
    const responder = makeResponder(resMock);
    responder(makeResponse(200,{msg:'ok'}));
    return expect(spy.callCount).to.equal(3);
  });

  it('use responder for error response', ()=>{
    const spy = sinon.spy();
    const resMock = {};
    resMock.status = resMock.json = resMock.end = ()=>{spy(); return resMock;};
    const responder = makeResponder(resMock);
    responder(makeErrorResponse(401,'No, sir. I don\'t like it.'));
    return expect(spy.callCount).to.equal(3);
  });

  it('use responder for bad response object', ()=>{
    const spy = sinon.spy();
    const resMock = {};
    resMock.status = resMock.json = resMock.end = ()=>{spy(); return resMock;};
    const responder = makeResponder(resMock);
    responder(makeResponse(200,null));
    return expect(spy.callCount).to.equal(3);
  });

});
