var iControl = require('../lib/iControl')
  , config = require('../config')
  , util = require('util');

var gw = new iControl({
  host:   config.host,
  user:   config.user,
  pass:   config.pass,
  strict: config.strict
});

gw.delete('/net/tunnels/tunnel/vxlan30001', function(err, data) {
  if (err) throw err;
  console.log(util.inspect(data));
});
