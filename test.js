#!/usr/bin/env node

var srs = require('srs');
var assert = require('assert');
//var path = require('path');
var fs = require('fs');


assert.throws(function () { srs.parse('foo') })
  
var srs_input1 = '+init=epsg:4326';
var srs1 = srs.parse(srs_input1);
assert.equal(srs1.proj4,'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ');
assert.equal(srs1.epsg,'4326');
assert.equal(srs1.auth,'EPSG');
assert.equal(srs1.esri,false);
assert.equal(srs1.is_geographic,true);
assert.equal(srs1.input,srs_input1);

var srs_input2 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
var srs2 = srs.parse(srs_input2);
assert.equal(srs2.proj4,'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ');
assert.equal(srs2.epsg,'4326');
assert.equal(srs2.auth,'EPSG');
assert.equal(srs2.esri,false);
assert.equal(srs2.is_geographic,true);
assert.equal(srs2.input,srs_input2);

var srs_input3 = 'WGS84';
var srs3 = srs.parse(srs_input3);
assert.equal(srs3.proj4,'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ');
assert.equal(srs3.epsg,'4326');
assert.equal(srs3.auth,'EPSG');
assert.equal(srs3.esri,false);
assert.equal(srs3.is_geographic,true);
assert.equal(srs3.input,srs_input3);

var data = fs.readFileSync('./data/4326.esri.prj');
var srs_input4 = data.toString();
var srs4 = srs.parse(srs_input4);
assert.equal(srs4.proj4,'+proj=longlat +ellps=WGS84 +no_defs ');
//assert.equal(srs4.proj4,'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ');
assert.equal(srs4.epsg,'4326');
assert.equal(srs4.auth,'EPSG');
assert.equal(srs4.esri,false);
assert.equal(srs4.is_geographic,true);
assert.equal(srs4.input,srs_input4);

console.log('All tests pass...');
