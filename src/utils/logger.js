/** Prints logs
 * usage:
 *   l_info = logger('info')
 *   l_info('Something happened')
 *   l_info('user', user.name, 'msg', 'Something happened')
*/
'use strict';

function loggerFactory(level){
  level = level.toUpperCase();
  return function logger(){
    let valPairs = [];
    let vals = Array.prototype.slice.call(arguments);
    if (level === 'ERROR') {
      vals = vals.concat(['stack', (new Error).stack]);
    }
    vals.forEach(function(e, i){
      if (i % 2 == 0) {
        return;
      } else {
        // use double quotes for multi word values (values containing a space)
        const valString = String(vals[i]);
        vals[i] = !~valString.indexOf(' ') ? vals[i] : `"${valString.replace(/"/g, '\\"')}"`;
        valPairs.push([vals[i-1], vals[i]].join('='));
      }
    });
    const message = `${(new Date).toISOString()} level=${level} ${valPairs.join(' ')}`;
    console.log(message);
    return message;
  };
}

module.exports = {
  lError : loggerFactory('error'),
  lInfo  : loggerFactory('info'),
  lWarn  : loggerFactory('warn')
};
