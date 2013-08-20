# changelog

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
