set PROJ_LIB=C:\mapnik-v2.3.0\share\proj
set GDAL_DATA=C:\mapnik-v2.3.0\share\gdal
rd /q /s build
del lib\\_srs.node
npm install --nodedir=%HOMEPATH%/.node-gyp/0.10.21-mod
set NODE_PATH=lib
npm test
