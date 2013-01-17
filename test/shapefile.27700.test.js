var srs = require('srs');
var fs = require('fs');
var assert = require('assert');


describe('OSGB 1936', function() {
    // https://github.com/springmeyer/node-srs/issues/25
    it('should detect both wkt variants the same', function() {
        var ogc_srs = fs.readFileSync('./test/data/27700_ogc_wkt.prj').toString();
        var ogc = srs.parse(ogc_srs);
        var esri_srs = fs.readFileSync('./test/data/27700_esri_wkt.prj').toString();
        var esri = srs.parse('ESRI::'+esri_srs);
        assert.equal(ogc.esri,false);
        assert.equal(ogc.name,esri.name);
        assert.equal(esri.esri,true);
    });
});