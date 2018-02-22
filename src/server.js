// serves the app
'use strict';

const app = require('./app');
const Settings = require('./Settings');
const lInfo = require('./utils/logger').lInfo;

// kick it off
const server = app.listen(Settings.T_ELEVATOR_PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  lInfo('service', 'elevator',
    'host', host,
    'port', port
  );
});
