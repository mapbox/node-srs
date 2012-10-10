var srs = require('srs');
var fs = require('fs');
var assert = require('assert');

var expected = srs.canonical.spherical_mercator;

describe('Mercator', function() {
    it('should detect non-sperical mercator', function() {
        // non spherical merc's - should not match
        //# WGS 84 / PDC Mercator (deprecated)
        //<3349> +proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs  <>
        // typo NAD83(NSRS2007) / Michigan Central
        //check_result('+init=epsg:3587',srs.canonical.spherical_mercator, false);
        var not_3857 = { srid: undefined, auth: undefined, esri: false, is_geographic: false, valid: true };
        var srid3349 = '+proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs';
        var parsed = srs.parse(srid3349);
        assert.ok(parsed.proj4);
        assert.equal(parsed.proj4, '+proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        assert.equal(parsed.srid, not_3857.srid);
        assert.equal(parsed.auth, not_3857.auth);
        assert.equal(parsed.esri, not_3857.esri);
        assert.equal(parsed.is_geographic, not_3857.is_geographic);
        assert.equal(parsed.valid, not_3857.valid);
    });

    /*

    EPSG:900913 aka. Spherical Mercator

    http://wiki.openstreetmap.org/wiki/EPSG:3857

    */

    it('should detect qgis/ogr wkt', function() {
        var val = fs.readFileSync('./test/data/world_borders_merc.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect r-org produced by older ogr version', function() {
        var val = fs.readFileSync('./test/data/sr-org-6-esriwkt.prj');
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect sr-ogr6', function() {
        var val = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect http://prj2epsg.org/epsg/3857', function() {
        var val = fs.readFileSync('./test/data/prj2epsg-wkt-3857.prj');
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect +over stripped', function() {
        var val = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect proj 3857', function() {
        var val = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect 900913', function() {
        var val = '+init=epsg:900913';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri 900913', function() {
        var val = fs.readFileSync('./test/data/900913.esri.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri 900913 hint', function() {
        var val = 'ESRI::' + fs.readFileSync('./test/data/900913.esri.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri webmerc', function() {
        var val = fs.readFileSync('./test/data/esri_webmerc.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri webmerc hint', function() {
        var val = 'ESRI::' + fs.readFileSync('./test/data/esri_webmerc.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri webmerc aux', function() {
        var val = fs.readFileSync('./test/data/esri_webmerc_auxshpere.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect webmerc aux hint', function() {
        var val = 'ESRI::' + fs.readFileSync('./test/data/esri_webmerc_auxshpere.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri webmerc aux2', function() {
        var val = fs.readFileSync('./test/data/esri_webmerc_auxshpere2.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect esri webmerc aux2 hint', function() {
        var val = 'ESRI::' + fs.readFileSync('./test/data/esri_webmerc_auxshpere2.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    // https://github.com/mapbox/tilemill/issues/1759
    it('should detect osm_landusages', function() {
        var val = 'ESRI::' + fs.readFileSync('./test/data/osm_landusages.prj').toString();
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect bogus proj 1', function() {
        var val = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs +foo';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

    it('should detect bogus proj 2', function() {
        var val = '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid, expected.srid);
        assert.equal(parsed.auth, expected.auth);
        assert.equal(parsed.esri, expected.esri);
        assert.equal(parsed.is_geographic, expected.is_geographic);
        assert.equal(parsed.valid, expected.valid);
    });

// failing, need attention
/*
    'esri 102100': function(beforeEdit,assert) {
        var val = '+init=esri:102100';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid,expected.srid);
        assert.equal(parsed.auth,expected.auth);
        assert.equal(parsed.esri,expected.esri);
        assert.equal(parsed.is_geographic,expected.is_geographic);
        assert.equal(parsed.valid,expected.valid);
    },
    'esri 102113': function(beforeEdit,assert) {
        var val = '+init=esri:102113';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid,expected.srid);
        assert.equal(parsed.auth,expected.auth);
        assert.equal(parsed.esri,expected.esri);
        assert.equal(parsed.is_geographic,expected.is_geographic);
        assert.equal(parsed.valid,expected.valid);
    },

    'epsg 3857': function(beforeEdit,assert) {
        var val = '+init=epsg:3857';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid,expected.srid);
        assert.equal(parsed.auth,expected.auth);
        assert.equal(parsed.esri,expected.esri);
        assert.equal(parsed.is_geographic,expected.is_geographic);
        assert.equal(parsed.valid,expected.valid);
    },

    'epsg 3785': function(beforeEdit,assert) {
        var val = '+init=epsg:3785';
        var parsed = srs.parse(val);
        assert.ok(parsed.proj4);
        //assert.equal(parsed.proj4,'');
        assert.equal(parsed.srid,expected.srid);
        assert.equal(parsed.auth,expected.auth);
        assert.equal(parsed.esri,expected.esri);
        assert.equal(parsed.is_geographic,expected.is_geographic);
        assert.equal(parsed.valid,expected.valid);
    },
*/

});

