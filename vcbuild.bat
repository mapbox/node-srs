set PROJ_LIB=C:\dev2\proj\nad
set GDAL_DATA=C:\dev2\gdal\data
set target=Build
set config=Release
rm build.sln
python gyp/gyp build.gyp --depth=. -f msvs -G msvs_version=2010
msbuild build.sln
copy Default\\_srs.node lib\\_srs.node
rem test!
rem set NODE_PATH=lib
rem node node_modules\expresso\bin\expresso
rem node -e "console.log(require('mapnik'))"