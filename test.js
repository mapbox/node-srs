#!/usr/bin/env node

var srs = require('srs');
var assert = require('assert');
//var path = require('path');
var fs = require('fs');


assert.throws(function() { srs.parse('foo') });

var check_result = function(input,exp,pass) {
    var ref = srs.parse(input);
    if (pass) {
        console.log('TODO on this one...');
        console.log(ref);
    } else {
        //proj4 varies too much to compare exactly
        //console.log(ref.proj4)
        assert.equal(ref.epsg, exp.epsg);
        assert.equal(ref.auth, exp.auth);
        assert.equal(ref.esri, exp.esri);
        assert.equal(ref.is_geographic, exp.is_geographic);
        assert.equal(ref.input, input);
    }
    return ref;
};


/* EPSG:4326 aka. WGS84 */

expected = { epsg: 4326, auth: 'EPSG', esri: false, is_geographic: true };
check_result('+init=epsg:4326', expected);
check_result('WGS84', expected);
var data = fs.readFileSync('./data/4326.esri.prj');
check_result(data.toString(), expected);
var srs_input2 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
check_result(srs_input2, expected);
check_result('EPSG:4326', expected);
check_result('EPSG:4326', expected);
// proj4 variations
check_result('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', expected);
check_result('+proj=longlat +ellps=WGS84 +no_defs', expected);
// proj4 coming from gdal trunk
check_result('+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs', expected);


/* EPSG:900913 aka. Spherical Mercator */
expected = { epsg: undefined, auth: undefined, esri: false, is_geographic: false };
check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs', expected);
check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs +wkt', expected);
// best fit google mercator
ref = check_result('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over', expected);
// TODO - track down osr bug...
// osr drops the +nadgrids=@null ... not good
//console.log(ref.proj4);

//expected = { epsg: 900913, auth: 'EPSG', esri: false, is_geographic: false }
//check_result('+init=epsg:900913',expected,true);
//expected = { epsg: 3875, auth: 'EPSG', esri: false, is_geographic: false }
//check_result('+init=epsg:3857',expected, true);
// also 3785, 4055

console.log('All tests pass...');
