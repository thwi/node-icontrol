var iControl = require('../lib/iControl')
  , config = require('../config')
  , util = require('util');

var gw = new iControl({
  host:   config.host,
  user:   config.user,
  pass:   config.pass,
  strict: config.strict
});

gw.post({
  path: '/net/tunnels/tunnel',
  body: {
    'name': 'vxlan30001',
    'profile': 'vxlan',
    'key': '30001',
    'local-address': '10.1.20.254',
    'remote-address': '239.0.0.1'
  },
},
function(err, data) {
  if (err) throw err;
  console.log(util.inspect(data));
});
