const Http = require('http-status-codes');
const expect = require('chai').expect;
const sinon = require('sinon');

function makeFake (unirest, response) {
  const fake = () => {
    const fake = { end: cb => cb(response) };
    fake.headers = fake.send = () => fake;
    return fake;
  };
  sinon.stub(unirest, 'get').callsFake(fake);
  sinon.stub(unirest, 'post').callsFake(fake);
}

describe('the couch helper', ()=>{

  describe('getVersion',()=>{

    it('should call getVersion', () => {
      this.unirest = require('unirest');
      makeFake(this.unirest, { statusCode: 200, saying:'wow' });

      const Couch = require('../src/helpers/couch');
      return Couch.getVersion('sweetgroup').then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );

    });


    it('should call getVersion and handle unirest error', ()=> {
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});
      const Couch = require('../src/helpers/couch');
      return Couch.getVersion('sweetgroup').catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );

    });

    it('should call getVersion, with an empty groupname', ()=>{

      const Couch = require('../src/helpers/couch');
      return Couch.getVersion('').catch( r => {
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR);
      });

    });

    it('should call getVersion, with a missing groupname', ()=>{

      const Couch = require('../src/helpers/couch');
      return Couch.getVersion().catch( r => {
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR);
      });

    });

  });


  describe('allDocs',()=>{

    it('should call allDocs', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 200, saying: 'wow'});
      const Couch = require('../src/helpers/couch');

      return Couch.getAllDocs('sweetgroup', []).then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );
    });



    it('should call allDocs and handle a unirest error', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});

      const Couch = require('../src/helpers/couch');
      return Couch.getAllDocs('sweetgroup', []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });

    it('should call getAllDocs, with a missing groupname', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getAllDocs(undefined, []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });

    it('should call getAllDocs, with a missing ids', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getAllDocs('sweetgroup').catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


  });

  describe('allDocsRevs',()=>{

    it('should call allDocsRevs', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 200, saying: 'wow'});

      const Couch = require('../src/helpers/couch');

      return Couch.getAllDocsRevs('sweetgroup', []).then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );
    });



    it('should call allDocsRevs that returns an error', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});

      const Couch = require('../src/helpers/couch');

      return Couch.getAllDocsRevs('sweetgroup', []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getAllDocs, with a missing group name', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getAllDocsRevs(undefined, []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getAllDocs, with a missing ids', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getAllDocsRevs('sweetgroup').catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });
  });


  describe('getByDKey',()=>{

    it('should call byDKey', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 200, saying: 'wow'});

      const Couch = require('../src/helpers/couch');

      return Couch.getByDKey('sweetgroup', []).then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );
    });


    it('should call byDKey that returns an error', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});

      const Couch = require('../src/helpers/couch');

      return Couch.getByDKey('sweetgroup', []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getByDKey, with a missing groupname', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getByDKey(undefined,[]).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


    it('should call getByDKey, with a missing dkeys', ()=>{
      const Couch = require('../src/helpers/couch');
      return Couch.getByDKey('sweetgroup').catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });


  });

  describe('getNotArchived',()=>{

    it('should call getNotArchived', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 200, saying: 'wow'});

      const Couch = require('../src/helpers/couch');

      return Couch.getNotArchived('sweetgroup', []).then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );
    });



    it('should call getNotArchived that returns an error', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});

      const Couch = require('../src/helpers/couch');

      return Couch.getNotArchived('sweetgroup', []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });
  });


  describe('getNotArchived',()=>{

    it('should call getNotArchived', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 200, saying: 'wow'});

      const Couch = require('../src/helpers/couch');

      return Couch.getNotArchived('sweetgroup', []).then( r =>
        expect(r.statusCode).to.equal(Http.OK)
      );
    });



    it('should call getNotArchived that returns an error', ()=>{
      this.unirest = require('unirest');
      makeFake(this.unirest, {statusCode: 0, error:'test error'});

      const Couch = require('../src/helpers/couch');

      return Couch.getNotArchived('sweetgroup', []).catch( r =>
        expect(r.statusCode).to.equal(Http.INTERNAL_SERVER_ERROR)
      );
    });
  });

  afterEach( ()=>{
    if (this.unirest && this.unirest.get.restore !== undefined) {
      this.unirest.get.restore();
      this.unirest.post.restore();
    }
  });

});
