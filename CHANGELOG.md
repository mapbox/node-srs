# changelog

0.3.4

 - Changed name of build option to configure against shared gdal lib. Now pass `npm install --shared_gdal` (to be consistent with older node-srs).

0.3.3

 - Now building against internal `osr` again by default. Pass `npm install --gdal=shared` to build against systemwide GDAL (#30)
 - Now forcing canonical wgs84/epsg:4326 represenation
 - Now translating `+init` syntax to `+proj` for known projections (epsg:4326 and epsg:3857)
 - Various fixes to detect more projections

0.3.2

 - Re-enabled optional linking with `gdal-config --dep-libs` by passing `npm install --runtime_link=static`

0.3.1

 - Removed build linking to gdal libs / gdal-config --dep-libs, now only linking to libgdal itself by default

0.3.0

 - Now using node-gyp for build
 - Now requiring Node >= 0.6.13 (for node-gyp support)
 - Node v0.10.x support
 - Now requiring external libgdal
 - Better detection of more spherical mercator variants
 - Better detection of +init=epsg based mercator srs and auto-transformation to +proj syntax
