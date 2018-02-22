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
    const vals = Array.prototype.slice.call(arguments);
    vals.forEach(function(e, i){
      if (i % 2 == 0) {
        return;
      } else {
        // use double quotes for multi word values (values containing a space)
        vals[i] = !~String(vals[i]).indexOf(' ') ? vals[i] : `"${vals[i].replace(/"/g, '\\"')}"`;
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
