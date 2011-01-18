#!/usr/bin/env node

var srs = require('srs');
var assert = require('assert');
//var path = require('path');
//var fs = require('fs');

assert.throws(function () { srs.inspect('foo') })
assert.equal(srs.inspect('+init=epsg:4326').proj4.trim(),'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
assert.equal(srs.inspect('+init=epsg:4326').proj4.trim(),'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');

//console.log(srs.inspect('GEOGCS["GCS_North_American_1983_CSRS98",DATUM["D_North_American_1983_CSRS98",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'));

console.log('All tests pass...');
