mkdir -p osr
rm -rf osr/*
cd osr
svn co https://svn.osgeo.org/gdal/trunk/gdal/port
svn co https://svn.osgeo.org/gdal/trunk/gdal/ogr
svn co https://svn.osgeo.org/gdal/trunk/gdal/data
cp data/* 
rm -rf ogr/ogrsf_frmts
rm -rf ogr/wcts
cd ../
patch osr/ogr/ogr_srs_proj4.cpp < ogr_srs_proj4.diff
mkdir osr/src
wget http://svn.osgeo.org/gdal/trunk/gdal/gcore/gdal_version.h
mv gdal_version.h osr/src/gdal_version.h
cp osr/ogr/ogr_srs*.* osr/src/
cp osr/ogr/ogrspatialreference.* osr/src/
cp osr/ogr/ogr_spatialref.h osr/src/
cp osr/ogr/osr_cs_wkt_parser.* osr/src/
cp osr/ogr/osr_cs_wkt.* osr/src/
cp osr/ogr/ogrct.* osr/src/
cp osr/ogr/ogr_fromepsg.* osr/src/
cp osr/ogr/ogr_core.h osr/src/
cp osr/ogr/ogr_p.h osr/src/
cp osr/ogr/ogr_geometry.h osr/src/
# cpl
cp osr/port/*.h osr/src/
cp osr/port/*.cpp osr/src/
rm osr/src/cpl_odbc.cpp
rm osr/src/cpl_vsil_gzip.cpp
rm osr/src/cpl_minizip_ioapi.cpp
rm osr/src/cpl_minizip_unzip.cpp
rm osr/src/cpl_minizip_zip.cpp
rm osr/src/cpl_win32ce_api.cpp
rm osr/src/vsipreload.cpp
rm osr/src/cpl_vsil_simple.cpp
rm osr/src/xmlreformat.cpp