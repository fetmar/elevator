const lInfo = require('../src/utils/logger').lInfo;
describe('logging', ()=>{
  it('should log a message', ()=>{
    const message = lInfo('label','test');
    expect(message).toMatch('label=test');
  });
  it('should log a message with spaces', ()=>{
    const message = lInfo('label','some label');
    expect(message).toMatch('label="some label"');
  });

});
