# node-icontrol

----
## Overview

Convience methods for configuring 

Requires BIG-IP >= 11.4

----
## Installation

> npm install icontrol

----
## Usage

# Create BIG-IP instance

> var iControl = require('icontrol');
>
> var bigip = new iControl({
>   host: '192.168.1.245',
>   proto: 'https',
>   port: 443,
>   user: 'admin',
>   pass: 'admin',
>   strict: true
> });

# GET: read/list object(s)

> bigip.get('/sys/software/image', function(err, res) {
>   if (err) throw err;
>   // do something with JSON result
> });

or alternatively

> bigip.get({
>   path: '/sys/software/image',
>   qs: '$expand=true'
> }, function(err, res) {
>   // do something with JSON result 
> });

# POST (create)

> bigip.post({
>   path: '/ltm/pool',
>   body: {
>     'name': 'test-pool',
>     'members': [
>       { 'name': '192.168.100.1:80', 'description': 'test-member-1' },
>       { 'name': '192.168.100.2:80', 'description': 'test-member-2' },
>       { 'name': '192.168.100.3:80', 'description': 'test-member-3' },
>     ]
>   }
> }, function(err, res) {
>   if (err) throw err;
>   // newly-created object
> });
>

# PUT (modify/edit existing object)

> bigip.put({
>   path: '/ltm/pool/test-pool',
>   body: {
>     'description': 'This pool should now have a description'
>   }
> }, function(err, res) {
>   if (err) throw err;
>   // updated JSON object
> });

# DELETE

> bigip.delete('/ltm/pool/test-pool', function(err, res) {
>   if (err) throw err;
>   // res should be null
> });

See the examples directory and F5 iControl REST API documentation for detail.

----
## TODO

* Collate paginated results
* More examples
* Unit tests

----
## Changelog
* 2014-01-28 Initial commit
