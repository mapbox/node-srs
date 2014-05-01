var srs = require('../');
var assert = require('assert');
var fs = require('fs');
var util = require('./util');

describe('GeoJSON', function() {
    it('should detect mercator', function() {
        var merc = srs.parse(srs.jsonCrs(JSON.parse(fs.readFileSync('./test/data/world_extent_merc.geojson'))));
        assert.equal(merc.proj4, srs.canonical.spherical_mercator.proj4);
    });

    it('should detect wgs84', function() {
        var parsed = srs.parse(srs.jsonCrs(JSON.parse(fs.readFileSync('./test/data/world_extent_wgs84.geojson'))));
        util.assert_wgs84(parsed);
    });

    it('should detect wgs84 2', function() {
        var parsed = srs.parse(srs.jsonCrs(JSON.parse(fs.readFileSync('./test/data/test.json'))));
        util.assert_wgs84(parsed);
    });

    it('should detect with no ext', function() {
        var parsed = srs.parse(srs.jsonCrs(JSON.parse(fs.readFileSync('./test/data/mystery-api'))));
        util.assert_wgs84(parsed);
    });
});
