var path = require('path');
var assert = require('assert');
var srs = require('./_srs');

/* assert ABI compatibility */
// otherwise register_fonts will throw with:
// "TypeError: first argument must be a path to a directory of fonts"
assert.ok(srs.versions.node === process.versions.node, 'The running node version "' + process.versions.node + '" does not match the node version that srs-mapnik was compiled against: "' + srs.versions.node + '"');

// push all C++ symbols into js module
for (var k in srs) { exports[k] = srs[k]; }