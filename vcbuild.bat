set PROJ_LIB=C:\dev2\proj\nad
set GDAL_DATA=C:\dev2\gdal\data
del build.sln
rd /q /s Default
del lib\\_srs.node
rd /q /s lib\\srs_data
python gyp/gyp build.gyp --depth=. -f msvs -G msvs_version=2010
msbuild build.sln
copy Default\\_srs.node lib\\_srs.node
rem test!
echo module.exports.static_osr = false; > lib\settings.js
set NODE_PATH=lib
node node_modules\mocha\bin\mocha
rem node -e "console.log(require('mapnik'))"
