var srs = require('srs');

if (parseInt(process.version.split('.')[1]) > 4) {

    var info = require('../package.json');

    exports['test version updated for release'] = function(beforeExit, assert) {
        assert.equal(info.version, srs.version);
    };

} else {

    exports['test version updated for release'] = function(beforeExit, assert) {
    };

}