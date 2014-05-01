var srs = require('../');
var fs = require('fs');
var assert = require('assert');

describe('Version check', function() {
    it('test version updated for release', function() {
        if (parseInt(process.version.split('.')[1]) > 4) {
            var info = require('../package.json');
            assert.equal(info.version, srs.version);
        }
    });
});
