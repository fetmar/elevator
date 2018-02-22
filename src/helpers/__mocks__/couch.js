// The Couch helper handles the REST calls to Tangerine specific Couch views.
'use strict';

module.exports = {
  // get all assessments not archived.
  getNotArchived: function getNotArchived() {
    return Promise.resolve({
      statusCode: 200,
      body: {rows:[{id:'one',key:'one',value:{rev:'two'}}]}
    });
  },

  // get the revs for all the ids
  getAllDocsRevs: function getAllDocsRevs() {
    return Promise.resolve({
      statusCode:200,
      body:{'total_rows':2,'offset':0,'rows':[
        {'id':'one','key':'one','value':{'rev':'two'}},
        {'id':'updates','key':'updates','value':{'rev':'something'}}
      ]}
    });
  },

  // get the docs for all the ids
  getAllDocs: function getAllDocs() {
    return Promise.resolve({
      statusCode: 200,
      body: {'total_rows':1,'offset':0,'rows':[
        {id:'one',value:{rev:'two'},doc:{number:'1','_id':'version'}}
      ]}
    });
  },


  // get the version document.
  getVersion: function getVersion() {
    return Promise.resolve({
      statusCode: 200,
      body: {number:'1','_id':'version'}
    });
  },

  // get documents associated with an assessment by the dkey.
  getByDKey: function getByDKey() {
    return Promise.resolve({
      statusCode: 200,
      body:
      {'total_rows':2,'offset':0,'rows': [
        {'id':'one','key':'one','value':{'rev':'two'}},
        {'id':'updates','key':'updates','value':{'rev':'something'}}
      ]}
    });
  }
};
