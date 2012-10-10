var srs = require('srs');
var assert = require('assert');

describe('GeoJSON', function() {
    it('should detect mercator', function() {
        var merc = srs.parse('./test/data/world_extent_merc.geojson');
        assert.equal(merc.proj4, '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over');
    });

    it('should detect wgs84', function() {
        var wgs84 = srs.parse('./test/data/world_extent_wgs84.geojson');
        assert.equal(wgs84.proj4, '+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs');
    });

    it('should detect wgs84 2', function() {
        var wgs84_2 = srs.parse('./test/data/test.json');
        assert.equal(wgs84_2.proj4, '+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs');
    });

    it('should detect with no ext', function() {
        var wgs84 = srs.parse('./test/data/mystery-api');
        assert.equal(wgs84.proj4, '+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs');
    });
});
