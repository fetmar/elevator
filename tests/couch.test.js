const Http = require('http-status-codes');

describe('the couch helper', ()=>{

  describe('getVersion',()=>{

    it('should call getVersion', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying:'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getVersion('sweetgroup').then(
        r => expect(r.statusCode).toEqual(Http.OK)
      );

    });



    it('should call getVersion and handle unirest error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getVersion('sweetgroup').catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );

    });

    it('should call getVersion, with a missing groupname', ()=>{

      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getVersion('').catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );

    });

    it('should call getVersion, with a missing groupname', ()=>{

      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getVersion().catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );

    });


  });

  describe('allDocs',()=>{

    it('should call allDocs', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying: 'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getAllDocs('sweetgroup', []).then(function(response){
        expect(response);
      });
    });



    it('should call allDocs and handle a unirest error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getAllDocs('sweetgroup', []).catch(function(response){
        expect(response);
      });
    });



    it('should call getAllDocs, with a missing groupname', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getAllDocs(undefined, []).catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });

    it('should call getAllDocs, with a missing ids', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getAllDocs('sweetgroup').catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });


  });

  describe('allDocsRevs',()=>{

    it('should call allDocsRevs', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying:'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getAllDocsRevs('sweetgroup', []).then(function(response){
        expect(response);
      });
    });



    it('should call allDocsRevs that returns an error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getAllDocsRevs('sweetgroup', []).catch(function(response){
        expect(response);
      });
    });


    it('should call getAllDocs, with a missing group name', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getAllDocsRevs(undefined, []).catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getAllDocs, with a missing ids', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getAllDocsRevs('sweetgroup').catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });
  });


  describe('getByDKey',()=>{

    it('should call byDKey', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying:'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getByDKey('sweetgroup', []).then(function(response){
        expect(response);
      });
    });


    it('should call byDKey that returns an error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getByDKey('sweetgroup', []).catch(function(response){
        expect(response);
      });
    });


    it('should call getByDKey, with a missing groupname', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getByDKey(undefined,[]).catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getByDKey, with a missing dkeys', ()=>{
      const Couch = require('../src/helpers/couch');
      expect.assertions(1);
      return Couch.getByDKey('sweetgroup').catch(
        r => expect(r.statusCode).toEqual(Http.INTERNAL_SERVER_ERROR)
      );
    });


  });

  describe('getNotArchived',()=>{

    it('should call getNotArchived', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying:'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getNotArchived('sweetgroup', []).then(function(response){
        expect(response);
      });
    });



    it('should call getNotArchived that returns an error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getNotArchived('sweetgroup', []).catch(function(response){
        expect(response);
      });
    });
  });


  describe('getNotArchived',()=>{

    it('should call getNotArchived', ()=>{
      jest.mock('unirest', ()=>{
        const response = {statusCode: 200, saying:'wow'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getNotArchived('sweetgroup', []).then(function(response){
        expect(response);
      });
    });



    it('should call getNotArchived that returns an error', ()=>{

      jest.mock('unirest', ()=>{
        const response = {statusCode: 0, error:'test error'};
        const baseMock = {end:jest.fn((cb)=>cb(response))};
        baseMock.headers = baseMock.get = baseMock.post = baseMock.send = () => baseMock;
        return baseMock;
      });

      const Couch = require('../src/helpers/couch');

      Couch.getNotArchived('sweetgroup', []).catch(function(response){
        expect(response);
      });
    });
  });

  beforeAll(()=>{
    jest.resetModules();
  });
  afterEach(()=>{
    jest.resetModules();
  });

});
