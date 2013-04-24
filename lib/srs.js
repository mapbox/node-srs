var path = require('path');
var fs = require('fs');
var srs = require('./_srs');
var _settings = require('./settings');
var exists = require('fs').existsSync || require('path').existsSync;

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

var merc_pretty_wkt = 'PROJCS["WGS 84 / Pseudo-Mercator",\n    GEOGCS["WGS 84",\n        DATUM["WGS_1984",\n            SPHEROID["WGS 84",6378137,298.257223563,\n                AUTHORITY["EPSG","7030"]],\n            AUTHORITY["EPSG","6326"]],\n        PRIMEM["Greenwich",0,\n            AUTHORITY["EPSG","8901"]],\n        UNIT["degree",0.0174532925199433,\n            AUTHORITY["EPSG","9122"]],\n        AUTHORITY["EPSG","4326"]],\n    UNIT["metre",1,\n        AUTHORITY["EPSG","9001"]],\n    PROJECTION["Mercator_1SP"],\n    PARAMETER["central_meridian",0],\n    PARAMETER["scale_factor",1],\n    PARAMETER["false_easting",0],\n    PARAMETER["false_northing",0],\n    EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"],\n    AUTHORITY["EPSG","3857"],\n    AXIS["X",EAST],\n    AXIS["Y",NORTH]]';

var lon_lat_pretty_wkt = 'GEOGCS["WGS 84",\n    DATUM["WGS_1984",\n        SPHEROID["WGS 84",6378137,298.257223563,\n            AUTHORITY["EPSG","7030"]],\n        TOWGS84[0,0,0,0,0,0,0],\n        AUTHORITY["EPSG","6326"]],\n    PRIMEM["Greenwich",0,\n        AUTHORITY["EPSG","8901"]],\n    UNIT["degree",0.0174532925199433,\n        AUTHORITY["EPSG","9108"]],\n    AUTHORITY["EPSG","4326"]]';

exports.canonical = {
  spherical_mercator: {
      proj4: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over',
      srid: 3857, // or 900913
      auth: 'EPSG',
      pretty_wkt: merc_pretty_wkt,
      esri: false,
      name: 'Google Maps Global Mercator', // so many variants here
      valid: true,
      is_geographic: false
  },
  wgs_84: {
      proj4: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
      srid: 4326,
      auth: 'EPSG',
      pretty_wkt: lon_lat_pretty_wkt,
      esri: false,
      name: 'WGS 84',
      valid: true,
      is_geographic: true
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
  'WGS_1984_Web_Mercator_Auxiliary_Sphere', // ESRI
  'Popular_Visualisation_CRS_Mercator_deprecated' // wtf
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

var known_esri_variant_special_cases = [
  ['DATUM["D_OSGB_1936"','DATUM["OSGB_1936"']
];

/*
if we have statically linked libosr then we need
to set the GDAL_DATA directory so that the bundled
.csv and .wkt files are found.
*/
if (_settings.static_osr) {
    process.env.GDAL_DATA = path.join(__dirname, 'srs_data');
}


// push all C++ symbols into js module
for (var k in srs) { exports[k] = srs[k]; }

// make settings available
exports.settings = _settings;

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
            if (pair[1] && pair[1] === '0') {
                // https://github.com/mapbox/tilemill/issues/1866
                pair[1] = '0.0'
            }
            pairs[pair[0]] = pair[1];
        }
    }
    return pairs;
};

var canonical_parts = exports.split_proj(exports.canonical.spherical_mercator.proj4);
var canonical_stringify = JSON.stringify(canonical_parts);

exports.parse = function(arg) {

    if (arg instanceof Buffer) {
        arg = arg.toString();
    }

    if (exists(arg)) {
        var extension = path.extname(arg).toLowerCase();
        var is_json = false;
        if (extension == '.json' || extension == '.geojson') {
            is_json = true;
        }
        var file_data = fs.readFileSync(arg);
        if (!is_json) {
           if (file_data[0] == '{') {
               is_json = true;
           } else {
                 var fstring = file_data.toString();
                 if (
                     ((fstring.search('"type"') > -1) && (fstring.search('"coordinates"') > -1))
                     || (fstring.search('"FeatureCollection"') > -1)
                     || ((fstring.search('"geometryType"') > -1) && (fstring.search('"esriGeometry"') > -1))
                    )
                 {
                   is_json = true;
                 }
           }
        }
        if (is_json) {
            var file = JSON.parse(file_data);
            if (file.crs && file.crs.properties && file.crs.properties.urn) {
                arg = file.crs.properties.urn;
            } else if (file.crs && file.crs.properties && file.crs.properties.name) {
                arg = file.crs.properties.name;
            } else {
                arg = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
            }
        }
    }
    
    for (var hack in known_esri_variant_special_cases) {
        var obj = known_esri_variant_special_cases[hack];
        if (arg.indexOf(obj[0]) > -1) {
            arg = arg.replace(obj[0],obj[1]);
        }
    }
    var result;

    try {
        result = srs._parse(arg);
    } catch (e) {
        if (arg.indexOf('ESRI::') !== 0) {
            result = srs._parse('ESRI::' + arg);
        } else {
            throw e;
        }
    }

    // detect mercator variants and
    // replace with canonical.spherical_mercator
    if (result.name in oc(merc_names)) {
        // this should be a fast track for many .prj files
        return force_merc(result);
    } else if (result.srid in oc(merc_srids)) {
        return force_merc(result);
    } else if (result.proj4 !== undefined && result.proj4.indexOf('+proj=merc') != -1) {
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
        }
    }

    // detect OSGB variant and fix the srid
    // https://github.com/springmeyer/node-srs/issues/25
    if (!result.srid && result.name == 'OSGB 1936 / British National Grid') {
        result.srid = 27700;
        result.auth = 27700;
    }

    return result;
};
