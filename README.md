# node-icontrol

## Overview

Convience methods for making calls to the BIG-IP iControl REST API.

Requires BIG-IP >= 11.4

## Installation

```
npm install icontrol
```

## Usage

### Create BIG-IP instance

```
var iControl = require('icontrol');

var bigip = new iControl({
  host: '192.168.1.245',
  proto: 'https',
  port: 443,
  user: 'admin',
  pass: 'admin',
  strict: true
});
```

### GET
## Read configuration object(s)

```
bigip.get('/sys/software/image', function(err, res) {
  // do something with result
});
```

or alternatively

```
bigip.get({
  path: '/sys/software/image',
  qs: '$expand=true'
}, function(err, res) {
  // do something with result
});
```

### POST
## Create configuration object(s)

```
bigip.post({
  path: '/ltm/pool',
  body: {
    'name': 'test-pool',
    'members': [
      { 'name': '192.168.100.1:80', 'description': 'test-member-1' },
      { 'name': '192.168.100.2:80', 'description': 'test-member-2' },
      { 'name': '192.168.100.3:80', 'description': 'test-member-3' },
    ]
  }
}, function(err, res) {
  if (err) throw err;
  // newly-created object
});
````

### PUT
## Modify existing configuration object

```
bigip.put({
  path: '/ltm/pool/test-pool',
  body: {
    'description': 'This pool should now have a description'
  }
}, function(err, res) {
  if (err) throw err;
  // updated JSON object
});
```

### DELETE
## Delete existing configuration object

```
bigip.delete('/ltm/pool/test-pool', function(err, res) {
  // res should be undefined
});
```

See F5 iControl REST API documentation for detail.

## TODO

* Collate paginated results
* More examples
* Unit tests
