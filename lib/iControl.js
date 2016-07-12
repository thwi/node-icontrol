// lib/iControl.js
var request = require('request');

// Constructor
var iControl = function(opts) {

  // Set default options
  this.host   = (typeof opts.host   === 'string')  ? opts.host   : '127.0.0.1';
  this.proto  = (typeof opts.proto  === 'string')  ? opts.proto  : 'https';
  this.port   = (typeof opts.port   === 'number')  ? opts.port   : 443;
  this.user   = (typeof opts.user   === 'string')  ? opts.user   : 'admin';
  this.pass   = (typeof opts.pass   === 'string')  ? opts.pass   : 'admin';
  this.strict = (typeof opts.strict === 'boolean') ? opts.strict : true;
  this.debug  = (typeof opts.debug  === 'boolean') ? opts.debug  : false;

  if (this.debug) { request.debug = true; }

  // Allow self-signed cert if strict not set
  // https://github.com/joyent/node/pull/4023
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = (this.strict) ? "1" : "0";
};

// List
iControl.prototype.list = function(path, opts, cb) {

  // No options have been specified
  if (arguments.length === 2) {
    cb = opts;
    opts = {};
  }

  // Options have been specified
  else {

    // Parse options
    // TODO: support other options
    var queryComponents = [];
    if (opts.expandAll)    queryComponents.push('$expand=*');
    if (opts.includeStats) queryComponents.push('$stats=true');

    // Build query string
    if (queryComponents.length !== 0) {
      opts.query = '?' + queryComponents.join('&');
    }
  }
  opts.path = path;
  opts.method = 'GET';
  this._request(opts, cb);
};

// Create
iControl.prototype.create = function(path, body, cb) {
  var opts = { path: path, body: body, method: 'POST' };
  this._request(opts, cb);
};

// Modify
iControl.prototype.modify = function(path, body, cb) {
  var opts = { path: path, body: body, method: 'PUT' };
  this._request(opts, cb);
};

// Delete
iControl.prototype.delete = function(path, cb) {
  var opts = { path: path, method: 'DELETE' };
  this._request(opts, cb);
};

// Execute request
iControl.prototype._request = function(opts, cb) {
  if (typeof opts.path !== 'string') return cb('URL must be specified', null);
  this.url = '/mgmt/tm' + opts.path;
  this.uri = this.proto + '://' + this.host + ':' + this.port + this.url;
  this.method = opts.method;

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
    rejectUnauthorized: this.strict
  };

  // If body has been specified, add to request options
  if (typeof opts.body === 'object') this.requestOpts.body = opts.body;

  // If query string has been specified, add to request options
  if (typeof opts.query === 'string') this.requestOpts.qs = opts.query;

  // Do request
  request(this.requestOpts, function(err, res, body) {

    // Protocol error
    if (err) return cb(err, false);

    // REST endpoint error
    if (res.statusCode !== 200) {
      var msg;

      if (res.statusCode === 404) {
        msg = '404: Not found for: ' + res.request.uri.href;
      }

      else {
        msg = body;
      }

      return cb(msg, false);
    }

    // If retrieving via GET, handle pagination
    if (this.method === 'GET') {

      // If data rows exist, return them
      if (body.items) {
        return cb(false, body.items);
      }

      // Otherwise, just return body
      else {
        return cb(false, body);
      }
    }

    // For POST/PUT/DELETE, return body
    else {
      return cb(false, body);
    }
  });
};

module.exports = iControl;
