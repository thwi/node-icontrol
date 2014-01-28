// lib/iControl.js
var request = require('request');

// Constructor
var iControl = function(opts) {
  this.host   = (typeof opts.host === 'string') ? opts.host : '127.0.0.1';
  this.proto  = (typeof opts.proto === 'string') ? opts.proto : 'https';
  this.port   = (typeof opts.port === 'number') ? opts.port : 443;
  this.user   = (typeof opts.user === 'string') ? opts.user : 'admin';
  this.pass   = (typeof opts.pass === 'string') ? opts.pass : 'admin';
  this.strict = (typeof opts.strict === 'boolean') ? opts.strict : true;

  // Allow self-signed cert if strict not set
  // https://github.com/joyent/node/pull/4023
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = (this.strict) ? "1" : "0";
};

// Convenience methods
iControl.prototype.get = function(opts, cb) {
  if (typeof opts === 'string') opts = { path: opts };
  opts.method = 'GET';
  this._request(opts, cb);
};

iControl.prototype.post = function(opts, cb) {
  opts.method = 'POST';
  this._request(opts, cb);
};

iControl.prototype.put = function(opts, cb) {
  opts.method = 'PUT';
  this._request(opts, cb);
};

iControl.prototype.delete = function(opts, cb) {
  if (typeof opts === 'string') opts = { path: opts };
  opts.method = 'DELETE';
  this._request(opts, cb);
};

// Execute request
iControl.prototype._request = function(opts, cb) {
  if (typeof opts.path !== 'string') return cb('URL must be specified', null);
  this.method = opts.method;
  this.url = '/mgmt/tm' + opts.path;
  this.uri = this.proto + '://' + this.host + ':' + this.port + this.url;

  // Build options for request
  this.requestOpts = {
    uri:     this.uri,
    method:  this.method,
    json:    true,
    auth: {
      user: this.user,
      pass: this.pass
    },
    strictSSL: this.strict,
    rejectUnhauthorized: this.strict
  };

  // If body has been specified, add to request options
  if (typeof opts.body === 'object') this.requestOpts.body = opts.body;

  // If GET method, set query string
  if (this.method === 'GET') {

    if (typeof opts.string === 'string') {
      this.requestOpts.qs = '?' + opts.string;
    }
    
    else {
      this.requestOpts.qs = '?$expand=*&$stats=true';
    }
  }

  // Do request
  request(this.requestOpts, function(err, resp, body) {

    // Protocol error
    if (err) return cb(err, false);

    // REST endpoint error
    if (resp.statusCode !== 200) {
      var msg;

      if (resp.statusCode === 404) {
        msg = '404: Not found';
      }

      // TODO: more better message extraction
      else if (body.message) {
        msg = body.message.match(/\\"message\\":\\"(.*)\\"}}",/)[1];
      }
      
      else {
        msg = body;
      }
      return cb(msg, false);
    }
    
    // If retrieving via GET, handle pagination
    if (this.method === 'GET') {

      // TODO: implement recursion to collate paginated results
      if (body.nextLink) {
        console.log('pagination not yet implemented');
      }
      
      else {
        return cb(false, body.items);
      }
    }
    
    else {
      return cb(false, body);
    }
  });
};

module.exports = iControl;
