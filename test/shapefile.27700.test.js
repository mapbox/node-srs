var srs = require('../');
var fs = require('fs');
var assert = require('assert');


describe('OSGB 1936', function() {

    it('should report that it was parsed as esri if ESRI:: was manually prepended', function() {
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        var esri_result = srs.parse('ESRI::'+esri_srs);
        assert.equal(esri_result.esri,true);
    });

    // https://github.com/mapbox/node-srs/issues/25
    it('should detect OGC format for OSGB 1936 / British National Grid', function() {
        var ogc_srs = fs.readFileSync('./test/data/27700_ogc_wkt.prj').toString();
        var ogc = srs.parse(ogc_srs);
        assert.equal(ogc.srid,27700);
        assert.equal(ogc.name,'OSGB 1936 / British National Grid');
        assert.equal(ogc.esri,false);
        assert.equal(ogc.proj4.indexOf('datum=OSGB36') > -1,true);
        assert.equal(ogc.proj4.indexOf('proj=tmerc') > -1,true);
        // not stable across gdal versions
        //assert.equal(ogc.proj4,'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs');
    });

    // https://github.com/mapbox/node-srs/issues/25
    it('should detect correct proj4 for ESRI format for OSGB 1936 / British National Grid', function() {
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        // parse by forcing ESRI:: prepend
        var esri_result = srs.parse('ESRI::'+esri_srs);
        assert.equal(esri_result.name,'OSGB 1936 / British National Grid');
        // should be:
        // +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs
        // not:
        // +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs
        assert.equal(esri_result.proj4.indexOf('datum=OSGB36') > -1,true);
        assert.equal(esri_result.proj4.indexOf('proj=tmerc') > -1,true);
        // not stable across gdal versions
        //var expected = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs';
        //assert.equal(esri_result.proj4,expected);
        // and test parsing without forcing ESRI:: prepend
        var esri_result2 = srs.parse(esri_srs);
        //assert.equal(esri_result2.proj4,expected);
        assert.equal(esri_result2.proj4.indexOf('datum=OSGB36') > -1,true);
        assert.equal(esri_result2.proj4.indexOf('proj=tmerc') > -1,true);
    });

    it('should detect correct srid for ESRI format for OSGB 1936 / British National Grid', function() {
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        var esri_result = srs.parse(esri_srs);
        assert.equal(esri_result.srid,27700);
    });
});