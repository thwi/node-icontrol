# node-icontrol

## Overview

Convience methods for making calls to the BIG-IP iControl REST API,
mimicking the command style of TMSH.

Requires BIG-IP >= 11.4.0 and an enabled ircd service:

```
(tmos) # modify sys service ircd add
```

See F5 iControl REST API documentation for detail:

https://devcentral.f5.com/d/icontrol-rest-user-guide

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

### List configuration object(s)
#### bigip.list(path, [options], callback)

```
bigip.list('/sys/software/image', function(err, res) {
  // do something with result
});
```

or alternatively with options:

```
bigip.list('/sys/software/image', {
  expandAll: true,
  includeStats: true
},
function(err, res) {
  // do something with result
});
```

### Create configuration object(s)
#### bigip.create(path, options, callback)

```
bigip.create('/ltm/pool', {
  'name': 'test-pool',
  'members': [
    { 'name': '192.168.100.1:80', 'description': 'test-member-1' },
    { 'name': '192.168.100.2:80', 'description': 'test-member-2' },
    { 'name': '192.168.100.3:80', 'description': 'test-member-3' },
  ]
},
function(err, res) {
  // newly-created object
});
````

### Modify existing configuration object
#### bigip.modify(path, options, callback);

```
bigip.modify('/ltm/pool/test-pool', {
  'description': 'This pool should now have a description'
},
function(err, res) {
  // updated JSON object
});
```

### Delete existing configuration object
#### bigip.delete(path, callback);

```
bigip.delete('/ltm/pool/test-pool', function(err, res) {
  // res should be undefined
});
```

## TODO

* List: collate paginated results
* List: more options support / docs
* All: unit tests
