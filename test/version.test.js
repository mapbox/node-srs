var srs = require('srs');
var info = require('../package.json');

exports['test version updated for release'] = function(beforeExit, assert) {
    assert.equal(info.version, srs.version);
};

