var gdal = require('gdal');

module.exports = function(str){
    var srs, auth, name, code;
    var result = {
        input: str,
        name: undefined,
        proj4: undefined,
        srid: undefined,
        auth: undefined,
        pretty_wkt: undefined,
        esri: undefined
    };

    try {
        srs = gdal.SpatialReference.fromUserInput(str);
        result.esri = str.indexOf('ESRI::') == 0;
    } catch (err) {
        srs = gdal.SpatialReference.fromESRI(str.split(/[ \t\n]/));
        result.esri = true;
    }

    result.valid = srs.validate() === null;
    
    try {
        result.proj4 = srs.toProj4();
    } catch (err) {}
    try {
        srs.autoIdentifyEPSG();
    } catch (err) {}
    
    if(!srs.isProjected()) {
        result.is_geographic = true;
        if(code = srs.getAuthorityCode('GEOGCS')) {
            result.srid = parseInt(code);
        }
        if(auth = srs.getAuthorityName('GEOGCS')) {
            result.auth = auth;
        }
        if(name = srs.getAttrValue('GEOGCS')) {
            result.name = name;
        }
    } else {
        result.is_geographic = false;
        if(code = srs.getAuthorityCode('PROJCS')) {
            result.srid = parseInt(code);
        }
        if(auth = srs.getAuthorityName('PROJCS')) {
            result.auth = auth;
        }
        if(name = srs.getAttrValue('PROJCS')) {
            result.name = name;
        }
    }

    try {
        result.pretty_wkt = srs.toPrettyWKT();
    } catch(err) {}

    return result;
}