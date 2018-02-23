var expect = require('chai').expect;

const lInfo = require('../src/utils/logger').lInfo;
describe('logging', ()=>{
  it('should log a message', ()=>{
    const message = lInfo('label','test');
    expect(message).to.match(/label=test/);
  });
  it('should log a message with spaces', ()=>{
    const message = lInfo('label','some label');
    expect(message).to.match(/label="some label"/);
  });

});
