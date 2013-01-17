var srs = require('srs');
var fs = require('fs');
var assert = require('assert');


describe('OSGB 1936', function() {

    it('should report that it was parsed as esri if ESRI:: was manually prepended', function() {
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        var esri_result = srs.parse('ESRI::'+esri_srs);
        assert.equal(esri_result.esri,true);
    });

    // https://github.com/springmeyer/node-srs/issues/25
    it('should detect OGC format for OSGB 1936 / British National Grid', function() {
        var ogc_srs = fs.readFileSync('./test/data/27700_ogc_wkt.prj').toString();
        var ogc = srs.parse(ogc_srs);
        assert.equal(ogc.srid,27700);
        assert.equal(ogc.name,'OSGB 1936 / British National Grid');
        assert.equal(ogc.esri,false);
    });

    // https://github.com/springmeyer/node-srs/issues/25
    it('should detect ESRI format for OSGB 1936 / British National Grid', function() {
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        var esri_result = srs.parse('ESRI::'+esri_srs);
        assert.equal(esri_result.name,'OSGB 1936 / British National Grid');
        assert.equal(esri_result.srid,27700);
    });
});