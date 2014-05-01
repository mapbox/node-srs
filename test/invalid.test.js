var srs = require('../');
var fs = require('fs');
var assert = require('assert');

// http://spatialreference.org/ref/esri/102685/
// http://spatialreference.org/ref/sr-org/7058/
describe('throws on invalid input', function() {
    it('detects proj if parsed as ESRI::', function() {
        assert.throws(function() {
            var ref = srs.parse('PROCS[]');
        });
    });
    it('init=epsg:3857', function() {
        assert.throws(function() {
            srs.parse('init=epsg:3857');
        });
    });
    it('+init=epsg', function() {
        assert.throws(function() {
            srs.parse('+init=epsg');
        });
    });
    it('+init=epsg:500', function() {
        assert.throws(function() {
            assert.ok(srs.parse('+init=epsg:500'));
        });
    });
});
