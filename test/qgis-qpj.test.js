var srs = require('../');
var fs = require('fs');
var assert = require('assert');

describe('qgis qpj format', function() {
    it('detects custom grids inside qgis transverse mercator projection', function(done) {
        var qgis = srs.parse(fs.readFileSync('./test/data/transverse_merc_kasey_custom_grids.prj'));
        var normal = srs.parse(fs.readFileSync('./test/data/transverse_merc_kasey.prj'));
        assert.ok(normal.proj4);
        assert.ok(qgis.proj4);
        assert.ok(qgis.proj4.indexOf('nadgrids=@conus') > 0);
        assert.ok(qgis.proj4.indexOf('proj=tmerc') > 0);
        assert.ok(qgis.proj4.indexOf('ellps=clrk66') > 0);
        assert.ok(normal.proj4.indexOf('nadgrids=@conus') == -1);
        assert.ok(normal.name,'Transverse_Mercator');
        assert.ok(normal.proj4.indexOf('proj=tmerc') > 0);
        assert.ok(normal.proj4.indexOf('ellps=clrk66') > 0);
        done();
    });
});
