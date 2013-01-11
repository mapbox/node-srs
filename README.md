
# Node-Srs
      
  Bindings to libosr for handling spatial references in [node](http://nodejs.org).

## Example

Detect a proj4 literal string as spherical mercator:

```js
> var srs = require('srs');
> srs.parse('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs')
{ proj4: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over',
  srid: 3857,
  auth: 'EPSG',
  pretty_wkt: 'PROJCS["WGS 84 / Pseudo-Mercator",\n    GEOGCS["WGS 84",\n        DATUM["WGS_1984",\n            SPHEROID["WGS 84",6378137,298.257223563,\n                AUTHORITY["EPSG","7030"]],\n            AUTHORITY["EPSG","6326"]],\n        PRIMEM["Greenwich",0,\n            AUTHORITY["EPSG","8901"]],\n        UNIT["degree",0.0174532925199433,\n            AUTHORITY["EPSG","9122"]],\n        AUTHORITY["EPSG","4326"]],\n    UNIT["metre",1,\n        AUTHORITY["EPSG","9001"]],\n    PROJECTION["Mercator_1SP"],\n    PARAMETER["central_meridian",0],\n    PARAMETER["scale_factor",1],\n    PARAMETER["false_easting",0],\n    PARAMETER["false_northing",0],\n    EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],\n    AUTHORITY["EPSG","3857"],\n    AXIS["X",EAST],\n    AXIS["Y",NORTH]]',
  esri: false,
  name: 'Google Maps Global Mercator',
  valid: true,
  is_geographic: false,
  input: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs' }
```

Detect a WKT string as WGS84:

```js
> srs.parse('GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]')
{ input: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]',
  proj4: '+proj=longlat +ellps=WGS84 +no_defs',
  srid: 4326,
  auth: 'EPSG',
  pretty_wkt: 'GEOGCS["GCS_WGS_1984",\n    DATUM["D_WGS_1984",\n        SPHEROID["WGS_1984",6378137,298.257223563]],\n    PRIMEM["Greenwich",0],\n    UNIT["Degree",0.017453292519943295],\n    AUTHORITY["EPSG","4326"]]',
  esri: false,
  name: 'GCS_WGS_1984',
  valid: true,
  is_geographic: true }
```

## Depends

  node >= 0.2.4 (development headers)
  
  No other required dependencies
  
  Optionally can depend/dynamically link to libgdal by doing:

      ./configure --shared-gdal
      make

  or:

      export NODE_SRS_SHARED_GDAL=1
      npm install srs


## Installation
  
  Install node-srs:
  
  From source:
  
    $ git clone git://github.com/springmeyer/node-srs.git
    $ cd node-srs
    $ ./configure
    $ make
    $ sudo make install
    $ make test

  Make sure the node modules is on your path:
  
    export NODE_PATH=/usr/local/lib/node/

  Or you can install via npm:
  
    $ npm install srs
  

## License

  BSD, see LICENSE.txt