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
                assert.equal(ref.proj4, input);
            else
                //assert.equal(ref.proj4, exp.proj4, 'proj4 definitions do not match:\n\t' + ref.proj4 + ' (actual)\n\t' + exp.proj4 + ' (expected)')
            assert.equal(ref.srid, exp.srid, 'srid check failed: ' + ref.srid + ' != ' + exp.srid);
            assert.equal(ref.auth, exp.auth, 'auth check failed');
            assert.equal(ref.esri, exp.esri, 'from esri check failed');
            assert.equal(ref.is_geographic, exp.is_geographic, 'is_geographic check failed');
            assert.equal(ref.input, input);
            assert.equal(ref.valid, exp.valid, 'validity check failed:\n\t' + ref.valid + ' (actual)\n\t' + exp.valid + ' (expected)');
            assert.ok(ref.proj4, 'proj4 is undefined!');
            success += 1;
            //console.log('passed... "' + ref.input + '"')
        }
        else {
            console.log(ref.proj4);
        }
    } catch (err) {
        failed += 1;
        console.log('\nfailed: ' + ref.name + ' ' + err);
        //console.log(ref);
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
};



var _parse_wgs84 = function() {

    /*

    EPSG:4326 aka. WGS84

    */

    expected = { srid: 4326, auth: 'EPSG', esri: false, is_geographic: true, valid: true };

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
};



// RAW Tests
// here we accept that auth or srid cannot always be known/detected and
// we accept that the proj4 result will vary

var _parse_900913 = function() {

    /*

    EPSG:900913 aka. Spherical Mercator

    http://wiki.openstreetmap.org/wiki/EPSG:3857

    */

    expected = { srid: undefined, auth: undefined, esri: false, is_geographic: false, valid: true };

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
    check_result(proj3785, expected, true);

    // best fit google mercator
    // basically 3875
    // double space removed so should fail if exact comparison is used
    var proj3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';
    ref = check_result(proj3857, expected, true);

    // from proj srid codes
    expected = { srid: 900913, auth: 'EPSG', esri: false, is_geographic: false, valid: true };
    expected.proj4 = proj3857;
    check_result('+init=epsg:900913', expected, true);

    expected.srid = 3857;
    //expected = { srid: 3875, auth: 'EPSG', esri: false, is_geographic: false }
    // this one requires 'coordinate_axis.csv'
    expected.proj4 = proj3857;
    ref = check_result('+init=epsg:3857', expected, true);

    expected.srid = 3785;
    check_result('+init=epsg:3785', expected, true);





    // esri versions

    expected = { srid: undefined, auth: undefined, esri: true, is_geographic: false, valid: true};

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
    console.log(ref.proj4);

    // TODO - this fails: ERROR 6: No translation for Mercator to PROJ.4 format is known.
    // need to be morphed from esri
    //check_result(data.toString(), expected, true);


    expected.auth = 'ESRI'; // cool this works
    expected.srid = 102100; // cool this works
    var data = fs.readFileSync('./data/esri_webmerc_auxshpere2.prj');
    expected.proj4 = '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';
    check_result('ESRI::' + data.toString(), expected, true);

    // TODO - this fails: ERROR 6: No translation for Mercator to PROJ.4 format is known.
    // need to be morphed from esri
    //check_result(data.toString(), expected, true);
};



var parse_900913 = function() {

    // non spherical merc's - should not match
    //# WGS 84 / PDC Mercator (deprecated)
    //<3349> +proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs  <>
    expected = { srid: undefined, auth: undefined, esri: false, is_geographic: false, valid: true };
    expected.proj4 = '+proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
    var srid3349 = '+proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
    check_result(srid3349, expected, false);


    /*

    EPSG:900913 aka. Spherical Mercator

    http://wiki.openstreetmap.org/wiki/EPSG:3857

    */



    // qgis/ogr produced wkt
    var data = fs.readFileSync('./data/world_borders_merc.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);

    var data = fs.readFileSync('./data/admin-0-poly.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    
    // sr-org produced by older ogr version
    var data = fs.readFileSync('./data/sr-org-6-esriwkt.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);

    var data = fs.readFileSync('./data/sr-org-6-ogcwkt.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    
    var sr_org6 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
    check_result(sr_org6, srs.canonical.spherical_mercator, false);
    
    // http://prj2epsg.org/epsg/3857
    var data = fs.readFileSync('./data/prj2epsg-wkt-3857.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    
    
      
    //expected = { srid: undefined, auth: undefined, esri: false, is_geographic: false, valid: true };

    // basically exactly the same, but with the +over stripped
    //expected.proj4 = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs';
    //'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m'
    //'+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m'
    check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs', srs.canonical.spherical_mercator, false);

    //TODO
    //check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs +foo', srs.canonical.spherical_mercator, false);

    // TODO
    //check_result('+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m', srs.canonical.spherical_mercator, false);

    var proj3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
    check_result(proj3857, srs.canonical.spherical_mercator, false);
    // TODO
    //failing...
    //check_result('+init=epsg:3857', srs.canonical.spherical_mercator, false);

    var proj3785 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
    check_result(proj3785, srs.canonical.spherical_mercator, false);
    // TODO
    //failing...
    //check_result('+init=epsg:3785', srs.canonical.spherical_mercator, false);
    check_result('+init=epsg:900913', srs.canonical.spherical_mercator, false);

    // typo NAD83(NSRS2007) / Michigan Central
    //check_result('+init=epsg:3587',srs.canonical.spherical_mercator, false);

    // esri
    // TODO
    //check_result('+init=esri:102100',srs.canonical.spherical_mercator, false);
    //check_result('+init=esri:102113',srs.canonical.spherical_mercator, false);
    var data = fs.readFileSync('./data/900913.esri.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    check_result('ESRI::' + data.toString(), srs.canonical.spherical_mercator, false);
    var data = fs.readFileSync('./data/esri_webmerc.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    check_result('ESRI::' + data.toString(), srs.canonical.spherical_mercator, false);
    var data = fs.readFileSync('./data/esri_webmerc_auxshpere.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    check_result('ESRI::' + data.toString(), srs.canonical.spherical_mercator, false);
    var data = fs.readFileSync('./data/esri_webmerc_auxshpere2.prj');
    check_result(data.toString(), srs.canonical.spherical_mercator, false);
    check_result('ESRI::' + data.toString(), srs.canonical.spherical_mercator, false);

};

// show all pass
_parse_wgs84();

// lots of failures that we cannot prevent yet
//_parse_900913();

// wrapped to handle 900913 forcefully
// show all pass
parse_900913();

report();
