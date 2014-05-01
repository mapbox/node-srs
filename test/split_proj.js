var srs = require('../');
var assert = require('assert');
var util = require('./util');

describe('#split_proj', function() {
    it('splits on spaces', function() {
        assert.deepEqual(srs.split_proj('a=b'), {a:'b'});
        assert.deepEqual(srs.split_proj('a=b c=d'), {a:'b',c:'d'});
        assert.deepEqual(srs.split_proj('a=b c=0'), {a:'b',c:'0.0'});
        assert.deepEqual(srs.split_proj('a=b c=2.0'), {a:'b',c:'2.0'});
        assert.deepEqual(srs.split_proj('a=b +bar c=2.0'), {a:'b',c:'2.0'});
    });
});
