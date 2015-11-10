# Node-Srs

Linux: [![Build Status](https://secure.travis-ci.org/mapbox/node-srs.svg)](http://travis-ci.org/mapbox/node-srs)

Windows: [![Build status](https://ci.appveyor.com/api/projects/status/ff1n3h7h506i4vx0)](https://ci.appveyor.com/project/Mapbox/node-srs)

This module tries to detect projections, also known as "spatial reference systems". It works similiarly to [gdalsrsinfo](http://www.gdal.org/gdalsrsinfo.html).

`node-srs` supports parsing a variety of textual representations of projections, like the formats known as `OGC WKT`, `ESRI WKT`, `OGC CRS URN`, or `proj4`. It supports [shapefiles](http://en.wikipedia.org/wiki/Shapefile) and [GeoJSON](http://geojson.org/). Shapefiles optionally come with a separate .prj and inside the `.prj` the text is usually in the `ESRI WKT` format. GeoJSON optionally contains a `crs` property that declares projection as `OGC CRS URN`.

Detecting projections is important for applications like TileMill, which - through Mapnik - needs the `proj4` representation of a projection to create coordinate transformations for re-projecting vector or raster data on the fly.

`node-srs` includes a variety of hacks to determine if your projection looks like `web mercator` (epsg:3857) or `wgs84` (epsg:4326) and if so returns the canonical representations of these projections (according to @springmeyer). This ensures applications like TileMill can avoid unneeded projection. It is common for data out in the wild in web mercator projection to store slightly different projection strings based on the software that created the files. `node-srs` ensures a consistent final `proj4` representation is returned for all of the variety of representations of web mercator. This is critical because even mercator to mercator transformations are expensive if proj4 is asked to do this for large datasets.

`node-srs` does not support looking for, or detecting, projection information in formats like GeoTIFF, PostGIS, or SQLite. Rather for those formats you would need to extract the projection information yourself and then pass it to `node-srs`.

## API

### `srs.parse(string)`

Parse a string of projection specification data and return an object describing
the detected projection. If the SRS cannot be parsed, throws a `TypeError`
describing the issue.

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

## Installation

    npm install

## Test

    npm test

## License

  BSD, see LICENSE.txt
