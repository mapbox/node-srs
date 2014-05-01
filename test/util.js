var assert = require('assert');
var srs = require('../');

function assert_wgs84(parsed) {
    assert.ok(parsed.proj4);
    assert.equal(parsed.name, srs.canonical.wgs84.name);
    assert.equal(parsed.srid, srs.canonical.wgs84.srid);
    assert.equal(parsed.auth, srs.canonical.wgs84.auth);
    assert.equal(parsed.esri, srs.canonical.wgs84.esri);
    assert.equal(parsed.is_geographic, srs.canonical.wgs84.is_geographic);
    assert.equal(parsed.valid, srs.canonical.wgs84.valid);
    assert.equal(parsed.proj4, srs.canonical.wgs84.proj4);
}

exports.assert_wgs84 = assert_wgs84;
