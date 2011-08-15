var path = require('path'),
    fs = require('fs'),
    assert = require('assert'),
    srs = require('./_srs'),
    _settings = require('./settings');

/*
 This is a custom srs definition for
 spherical mercator that we make
 canonical because no single variant
 of the projection stored by various
 applications is optimal.

 This is basically a modification of gdal's
 understanding of epsg 3857

 Changes:

 * add +over and +wktext to proj4 string
 * remove any double spaces in proj4 string
 * epsg is 3857, the new official epsg for 900913
 * name is pulled from gdal/data/cubwerx_extra.wkt for 900913
   instead of using 'WGS 84 / Pseudo-Mercator' or 'Popular...'

 TODO:
 * +x_0=0.0 vs +x_0=0 (same with +y_0)
 * handle two scaling aliases +k and +k_0
 * meaning of +k=1. vs +k=1.0 ?

*/

var merc_pretty_wkt = 'PROJCS["WGS 84 / Pseudo-Mercator",\n    GEOGCS["WGS 84",\n        DATUM["WGS_1984",\n            SPHEROID["WGS 84",6378137,298.257223563,\n                AUTHORITY["EPSG","7030"]],\n            AUTHORITY["EPSG","6326"]],\n        PRIMEM["Greenwich",0,\n            AUTHORITY["EPSG","8901"]],\n        UNIT["degree",0.0174532925199433,\n            AUTHORITY["EPSG","9122"]],\n        AUTHORITY["EPSG","4326"]],\n    UNIT["metre",1,\n        AUTHORITY["EPSG","9001"]],\n    PROJECTION["Mercator_1SP"],\n    PARAMETER["central_meridian",0],\n    PARAMETER["scale_factor",1],\n    PARAMETER["false_easting",0],\n    PARAMETER["false_northing",0],\n    EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],\n    AUTHORITY["EPSG","3857"],\n    AXIS["X",EAST],\n    AXIS["Y",NORTH]]';

exports.canonical = {
  spherical_mercator: {
      proj4: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over',
      srid: 3857, // or 900913
      auth: 'EPSG',
      pretty_wkt: merc_pretty_wkt,
      esri: false,
      name: 'Google Maps Global Mercator', // so many variants here
      valid: true,
      is_geographic: false
  }
};

function oc(a) {
    var o = {};
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = '';
    }
    return o;
}

var merc_names = [
  'Google_Maps_Global_Mercator',
  'Google Maps Global Mercator',
  'WGS 84 / Pseudo-Mercator', // 3857
  'Popular Visualisation CRS / Mercator', // 3785
  'WGS_1984_Web_Mercator', // ESRI
  'WGS_1984_Web_Mercator_Auxiliary_Sphere' // ESRI
  ];

var merc_srids = [
  900913, // neo-hippy followers of http://crschmidt.net/
  3857, // epsg official, second try
  3785, // epsg deprecated, failed first try
  //3587, // common typo but actually NAD83(NSRS2007) / Michigan Central
  102100, // esri official, second try
  102113, // esri deprecated, failed first try
  41001 //osgeo
  ];

/*
if we have statically linked libosr then we need
to set the GDAL_DATA directory so that the bundled
.csv and .wkt files are found.
*/
if (_settings.static_osr) {
    process.env.GDAL_DATA = path.join(__dirname, 'srs_data');
}

/* assert ABI compatibility */
assert.ok(srs.versions.node === process.versions.node, 'The running node version "' + process.versions.node + '" does not match the node version that node-srs was compiled against: "' + srs.versions.node + '"');

// push all C++ symbols into js module
for (var k in srs) { exports[k] = srs[k]; }

// make settings available
exports['settings'] = _settings;

var force_merc = function(result) {
    var new_merc = exports.canonical.spherical_mercator;
    new_merc.input = result.input;
    return new_merc;
};

exports.split_proj = function(literal) {
    var parts = literal.split(' ');
    // remove blank parts due to double spaces (common in proj epsg table)
    var len = parts.length;
    for (i = 0; i < len; i++) {
        if (parts[i] === '') {
            parts.splice(i, 1);
        }
    }
    // break into key=value pairs, discarding +modifiers without values
    var pairs = {};
    parts.sort();
    var new_len = parts.length;
    for (i = 0; i < new_len; i++) {
        var p = parts[i];
        if (p.indexOf('=') != -1) {
            var pair = p.split('=');
            pairs[pair[0]] = pair[1];
        }
    }
    return pairs;
};

var canonical_parts = exports.split_proj(exports.canonical.spherical_mercator.proj4);
var canonical_stringify = JSON.stringify(canonical_parts);

// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
/*
Object.prototype.equals = function(x) {
    for (p in this)
    {
        if (typeof(x[p]) == 'undefined') {return false;}
    }
    for (p in this)
    {
        if (this[p])
        {
            switch (typeof(this[p]))
            {
                    case 'object':
                            if (!this[p].equals(x[p])) { return false } break;
                    case 'function':
                            if (typeof(x[p]) == 'undefined' || (p != 'equals' && this[p].toString() != x[p].toString())) { return false; } break;
                    default:
                            if (this[p] != x[p]) { return false; }
            }
        }
        else
        {
            if (x[p])
            {
                return false;
            }
        }
    }
    for (p in x)
    {
        if (typeof(this[p]) == 'undefined') {return false;}
    }
    return true;
};
*/


exports.parse = function(arg) {
    var extension = path.extname(arg).toLowerCase();
    if (extension == '.json' || extension == '.geojson') {
        var file = JSON.parse(fs.readFileSync(arg));
        if (file.crs && file.crs.properties && file.crs.properties.name) {
            arg = file.crs.properties.name;
        }
        else {
            arg = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
        }
    }

    try {
        result = srs.parse(data);
    } catch (e) {
        if (!data.indexOf('ESRI::') === 0) {
            result = srs.parse('ESRI::' + data);
        } else {
            throw e;
        }
    }
    // detect mercator variants and
    // replace with canonical.spherical_mercator
    // TODO - early returns

    if (result.name in oc(merc_names)) {
        // this should be a fast track for many .prj files
        return force_merc(result);
    } else if (result.srid in oc(merc_srids)) {
        return force_merc(result);
    } else if (result.proj4 != undefined && result.proj4.indexOf('+proj=merc') != -1) {
        // catch case of gdal's translation to proj4 being used as input
        if (result.proj4 === '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs') {
           return force_merc(result);
        } else if (result.proj4 === '+proj=merc +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs') {
           return force_merc(result);        
        }
        // break into parts
        // TODO - sort and remove less critical pairs
        var parts = exports.split_proj(result.proj4);
        if (JSON.stringify(parts) === canonical_stringify) {
            return force_merc(result);
        } /*else {
                console.log(parts);
                console.log(canonical_parts)
                //if (parts.equals(canonical_parts)) {
                //return force_merc(result);
        }*/
    }
    return result;
};
