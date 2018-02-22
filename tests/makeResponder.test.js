const makeResponder = require('../src/utils/makeResponder');

describe('makeResponder', ()=>{

  it('make responder', ()=>{
    const res = jest.fn();
    const responder = makeResponder(res);
    expect(responder).not.toBe(undefined);
  });

  it('use responder for successful response', ()=>{
    const makeResponse = require('../src/utils/makeResponse');
    const resMock = {};
    const baseMock = jest.fn(()=>resMock);
    resMock.status = resMock.json = resMock.end = baseMock;
    const responder = makeResponder(resMock);
    const successful = makeResponse(200,{msg:'ok'});
    responder(successful);
    expect(baseMock).toHaveBeenCalledTimes(3);
  });

  it('use responder for error response', ()=>{
    const makeErrorResponse = require('../src/utils/makeResponse');
    const resMock = {};
    const baseMock = jest.fn(()=>resMock);
    resMock.status = resMock.json = resMock.end = baseMock;
    const responder = makeResponder(resMock);
    const successful = makeErrorResponse(401,'No, sir. I don\'t like it.');
    responder(successful);
    expect(baseMock).toHaveBeenCalledTimes(3);
  });

  it('use responder for bad response object', ()=>{
    const makeResponse = require('../src/utils/makeResponse');
    const resMock = {};
    const baseMock = jest.fn(()=>resMock);
    resMock.status = resMock.json = resMock.end = baseMock;
    const responder = makeResponder(resMock);
    const successful = makeResponse(200,null);
    responder(successful);
    expect(baseMock).toHaveBeenCalledTimes(3);
  });

});
