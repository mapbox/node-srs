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

module.exports.merc_names = [
    'Google_Maps_Global_Mercator',
    'Google Maps Global Mercator',
    'WGS 84 / Pseudo-Mercator', // 3857
    'WGS_84_Pseudo_Mercator', // 3857 with new gdal/ogr name as per https://github.com/mapbox/node-srs/issues/27
    'Popular Visualisation CRS / Mercator', // 3785
    'WGS_1984_Web_Mercator', // ESRI
    'WGS_1984_Web_Mercator_Auxiliary_Sphere', // ESRI
    'Popular_Visualisation_CRS_Mercator_deprecated', // wtf
    'Mercator_1SP',
    'Mercator_2SP'
];

module.exports.merc_srids = [
    900913, // http://crschmidt.net/blog/archives/243/google-projection-900913/
    3857, // epsg official, second try
    3785, // epsg deprecated, failed first try
    102100, // esri official, second try
    102113, // esri deprecated, failed first try
    41001 //osgeo
];

// commonly confused as spherical mercator, but not, right?
// here only for reference currently, nothing done programmatically
module.exports.other_merc_srids = [
    3395, // "WGS 84 / World Mercator" or normal, no googlized mercator: lacked +a=6378137 +b=6378137
    3587, // common typo but actually NAD83(NSRS2007) / Michigan Central
    // for these see also notes in shapefile.3857.test.js
    9804, // older, esri style-named traditional merc: http://www.remotesensing.org/geotiff/proj_list/mercator_1sp.html
    9805, // older, esri style-named traditional merc: http://www.remotesensing.org/geotiff/proj_list/mercator_2sp.html
];

module.exports.known_esri_variant_special_cases = [
    ['DATUM["D_OSGB_1936"','DATUM["OSGB_1936"']
];

module.exports.canonical = {
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
    wgs84: {
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
