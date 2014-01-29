var iControl = require('../lib/iControl')
  , config = require('../config')
  , util = require('util');

var gw = new iControl({
  host:   config.host,
  user:   config.user,
  pass:   config.pass,
  strict: config.strict
});

gw.create('/ltm/pool', {
  'name': 'test-pool',
  'members': [
    { 'name': '192.168.100.1:80', 'description': 'test-member-1' },
    { 'name': '192.168.100.2:80', 'description': 'test-member-2' },
    { 'name': '192.168.100.3:80', 'description': 'test-member-3' },
  ]
},
function(err, data) {
  if (err) throw err;
  console.log(util.inspect(data));
});
