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
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};

  // Parse options
  // TODO: support other options
  var queryComponents = [];
  if (opts.expandAll)    queryComponents.push('$expand=*');
  if (opts.includeStats) queryComponents.push('$stats=true');

  // Build query string
  if (queryComponents.length !== 0) {
    opts.query = '?' + queryComponents.join('&');
  }

  opts.path = path;
  opts.method = 'GET';
  this._request(opts, cb);
};

// Create
iControl.prototype.create = function(path, body, opts, cb) {
  // No options have been specified
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};

  opts.path = path;
  opts.body = body;
  opts.method = 'POST';

  this._request(opts, cb);
};

// Modify
iControl.prototype.modify = function(path, body, opts, cb) {
  // No options have been specified
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};

  opts.path = path;
  opts.body = body;
  opts.method = 'PUT';

  this._request(opts, cb);
};

// Delete
iControl.prototype.delete = function(path, opts, cb) {
  // No options have been specified
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};

  opts.path = path;
  opts.method = 'DELETE';

  this._request(opts, cb);
};

// Execute request
iControl.prototype._request = function(opts, cb) {
  var header;

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
  if (typeof opts.body === 'object' || typeof opts.body === 'string') this.requestOpts.body = opts.body;

  // If query string has been specified, add to request options
  if (typeof opts.query === 'string') this.requestOpts.qs = opts.query;

  // If headers have been specified, add to request options
  if (typeof opts.headers === 'object') {
    this.requestOpts.headers = opts.headers;

    // If we are specifying the content-type and it's not json, don't
    // set json as a request option
    for (header in opts.headers) {
      if (opts.headers.hasOwnProperty(header)) {
        if (header.toLowerCase() === 'content-type') {
          if (opts.headers[header] !== 'application/json') {
            this.requestOpts.json = false;
          }
        }
      }
    }
  }

  // Do request
  request(this.requestOpts, function(err, res, body) {

    // Protocol error
    if (err) return cb(err, false);

    // REST endpoint error
    if (res.statusCode !== 200) {
      var msg;

      if (res.statusCode === 404) {
        msg = '404: Not found';
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
