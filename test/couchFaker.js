const Http = require('http-status-codes');

module.exports = {
  make: function(sinon, real){

    // get all assessments not archived.
    sinon.stub(real, 'getNotArchived').callsFake(()=> {
      return Promise.resolve({
        statusCode: Http.OK,
        body: {rows:[{id:'one',key:'one',value:{rev:'two'}}]}
      });
    });

    // get the revs for all the ids
    sinon.stub(real, 'getAllDocsRevs').callsFake(()=> {
      return Promise.resolve({
        statusCode:Http.OK,
        body:{'total_rows':2,'offset':0,'rows':[
          {'id':'one','key':'one','value':{'rev':'two'}},
          {'id':'updates','key':'updates','value':{'rev':'something'}}
        ]}
      });
    });

    // get the docs for all the ids
    sinon.stub(real, 'getAllDocs').callsFake(()=> {
      return Promise.resolve({
        statusCode: Http.OK,
        body: {'total_rows':1,'offset':0,'rows':[
          {id:'one',value:{rev:'two'},doc:{number:'1','_id':'version'}}
        ]}
      });
    });


    // get the version document.
    sinon.stub(real, 'getVersion').callsFake(()=> {
      return Promise.resolve({
        statusCode: Http.OK,
        body: {number:'1','_id':'version'}
      });
    });

    // get documents associated with an assessment by the dkey.
    sinon.stub(real, 'getByDKey').callsFake(()=> {
      return Promise.resolve({
        statusCode: Http.OK,
        body:
        {'total_rows':2,'offset':0,'rows': [
          {'id':'one','key':'one','value':{'rev':'two'}},
          {'id':'updates','key':'updates','value':{'rev':'something'}}
        ]}
      });
    });


  },
  restore: function(fake){
    fake.getNotArchived.restore();
    fake.getVersion.restore();
    fake.getAllDocs.restore();
    fake.getAllDocsRevs.restore();
    fake.getByDKey.restore();
  }

};
