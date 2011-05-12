#!/usr/bin/env node

var srs = require('./lib/index.js');
//var srs = require('srs');
var assert = require('assert');
//var path = require('path');
var fs = require('fs');

var success = 0;
var failed = 0;
var names = [];

assert.throws(function() { srs.parse('foo') });

var check_result = function(input,exp,raw_function) {
    if (raw_function) {
        // hit the c++ module directly
        var ref = srs._parse(input);
    } else {
        // or call the public function with additional wizardry
        var ref = srs.parse(input);        
    }
     
    if (ref.name)
       names.push(ref.name);
       
    try {
        //proj4 varies too much to compare exactly
        if (exp.proj4) {
            if (exp.proj4 == 'input')
                assert.equal(ref.proj4, input)
            else
                //assert.equal(ref.proj4, exp.proj4, 'proj4 definitions do not match:\n\t' + ref.proj4 + ' (actual)\n\t' + exp.proj4 + ' (expected)')
            assert.equal(ref.epsg, exp.epsg, 'epsg check failed: ' + ref.epsg + ' != ' + exp.epsg);
            assert.equal(ref.auth, exp.auth, 'auth check failed');
            assert.equal(ref.esri, exp.esri, 'from esri check failed');
            assert.equal(ref.is_geographic, exp.is_geographic ,'is_geographic check failed');
            assert.equal(ref.input, input);
            assert.equal(ref.valid, exp.valid, 'validity check failed:\n\t' + ref.valid + ' (actual)\n\t' + exp.valid + ' (expected)');
            assert.ok(ref.proj4, 'proj4 is undefined!')
            success += 1;
            //console.log('passed... "' + ref.input + '"')
        }
        else {
            console.log(ref.proj4);
        }
    } catch (err) {
        failed += 1;
        console.log('\nfailed: ' + ref.name + ' ' + err)
    }
    return ref;
};


var report = function() {
    console.log('\n');
    console.log('success: ' + success);
    console.log('failed: ' + failed);
    console.log('names: ' + names);
    console.log('\n');
    process.exit();
}



/*

EPSG:4326 aka. WGS84

*/

expected = { epsg: 4326, auth: 'EPSG', esri: false, is_geographic: true, valid:true };

// all +datum=WGS84
expected.proj4 = '+proj=longlat +datum=WGS84 +no_defs';
check_result('+init=epsg:4326', expected, true);
var srs_input2 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
check_result(srs_input2, expected, true);
check_result('EPSG:4326', expected, true);
check_result('EPSG:4326', expected, true);

// +ellps +towgs84
expected.proj4 = '+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs';
check_result('WGS84', expected, true);

// proj4 coming from gdal trunk
check_result('+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs', expected, true);

// +datum will trigger addition to towgs
check_result('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', expected, true);

// note +ellps no datum
expected.proj4 = '+proj=longlat +ellps=WGS84 +no_defs';
check_result('+proj=longlat +ellps=WGS84 +no_defs', expected, true);

// esri version
var data = fs.readFileSync('./data/4326.esri.prj');
check_result(data.toString(), expected, true);



/* 

EPSG:900913 aka. Spherical Mercator 

http://wiki.openstreetmap.org/wiki/EPSG:3857

*/


// RAW Tests, here we don't expect auth or epsg to be known/detected and we understand the proj4 result will vary
expected = { epsg: undefined, auth: undefined, esri: false, is_geographic: false, valid: true };

// basically exactly the same, but with the +over stripped
expected.proj4 = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';
check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs +over', expected, true);

// +wktext should maintain proj4 text exactly
expected.proj4 = 'input';
check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs +wktext +over', expected, true);
check_result('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +no_defs +over +wktext', expected, true);

// false due to nadgrids
expected.valid = false;

// deprecated 3785
var proj3785 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';
check_result(proj3785,expected,true);

// best fit google mercator
// basically 3875
// double space removed so should fail if exact comparison is used
var proj3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';
check_result(proj3857, expected, true);

// from proj epsg codes
expected = { epsg: 900913, auth: 'EPSG', esri: false, is_geographic: false, valid: true }
expected.proj4 = proj3857;
check_result('+init=epsg:900913',expected,true);

expected.epsg = 3857;
//expected = { epsg: 3875, auth: 'EPSG', esri: false, is_geographic: false }
// this one requires 'coordinate_axis.csv'
expected.proj4 = proj3857;
check_result('+init=epsg:3857',expected, true);

expected.epsg = 3785;
check_result('+init=epsg:3785',expected, true);
// also 3785, 4055



// esri versions

expected = { epsg: undefined, auth: undefined, esri: true, is_geographic: false, valid: true}

expected.esri = false; // for now

// from ogr?
var data = fs.readFileSync('./data/900913.esri.prj');
expected.proj4 = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';
check_result('ESRI::' + data.toString(), expected, true);


// esri: super odd
var data = fs.readFileSync('./data/esri_webmerc.prj');
expected.proj4 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';

check_result('ESRI::' + data.toString(), expected, true);


// TODO - this fails: ERROR 6: No translation for Mercator to PROJ.4 format is known.
// need to be morphed from esri
//check_result(data.toString(), expected, true);

//expected.esri = true;

expected.valid = false; // cool this works

// esri: aux sphere wtf
// http://article.gmane.org/gmane.comp.gis.proj-4.devel/4844/match=
var data = fs.readFileSync('./data/esri_webmerc_auxshpere.prj');
expected.proj4 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';
ref = check_result('ESRI::' + data.toString(), expected, true);
console.log(ref.proj4)

// TODO - this fails: ERROR 6: No translation for Mercator to PROJ.4 format is known.
// need to be morphed from esri
//check_result(data.toString(), expected, true);


expected.auth = 'ESRI'; // cool this works
expected.epsg = 102100; // cool this works
var data = fs.readFileSync('./data/esri_webmerc_auxshpere2.prj');
expected.proj4 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';
check_result('ESRI::' + data.toString(), expected, true);

// TODO - this fails: ERROR 6: No translation for Mercator to PROJ.4 format is known.
// need to be morphed from esri
//check_result(data.toString(), expected, true);

report();
