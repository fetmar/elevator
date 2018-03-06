// serves the app
'use strict'

const app = require('./app')
const Settings = require('./Settings')
const lInfo = require('./utils/logger').lInfo

// Handle SIGINT from PM2
process.on('SIGINT', () => {
  lInfo('signal', 'SIGINT', 'msg', 'Exiting process.')
  process.exit(0)
})

// kick it off
const server = app.listen(Settings.T_ELEVATOR_PORT, () => {
  const host = server.address().address
  const port = server.address().port
  lInfo('service', 'elevator',
    'host', host,
    'port', port
  )
})
