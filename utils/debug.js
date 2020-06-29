// https://github.com/visionmedia/debug
const debug = require('debug');

if (debug.enabled) {
  console.log('Debug enabled');
}

let debugLog = debug('app:log');
let debugInfo = debug('app:info');
let debugError = debug('app:error');

// debugLog.log = console.log.bind(console);
// debugInfo.log = console.info.bind(console);
// debugError.log = console.error.bind(console);
debugLog('now goes to stdout via console.info');
debugInfo('still goes to stdout, but via console.info now');
debugError('ole.info now');
module.exports = {
  debugLog,
  debugInfo,
  debugError,
}
