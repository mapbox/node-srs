GDAL_VER="2.0.0"
wget http://download.osgeo.org/gdal/${GDAL_VER}/gdal-${GDAL_VER}.tar.gz
tar xf gdal-${GDAL_VER}.tar.gz
cp gdal-${GDAL_VER}/data/*.{csv,txt,wkt} ../lib/srs_data/
mkdir -p osr
rm -rf osr/*
# TODO - fix fuzz
mkdir -p osr/src
rm -rf osr/src/*
mv gdal-${GDAL_VER}/gcore/gdal_version.h osr/src/gdal_version.h
cp gdal-${GDAL_VER}/ogr/ogr_srs*.* osr/src/
cp gdal-${GDAL_VER}/ogr/ogrspatialreference.* osr/src/
cp gdal-${GDAL_VER}/ogr/ogr_spatialref.h osr/src/
cp gdal-${GDAL_VER}/ogr/osr_cs_wkt_parser.* osr/src/
cp gdal-${GDAL_VER}/ogr/osr_cs_wkt.* osr/src/
cp gdal-${GDAL_VER}/ogr/ogrct.* osr/src/
cp gdal-${GDAL_VER}/ogr/ogr_fromepsg.* osr/src/
cp gdal-${GDAL_VER}/ogr/ogr_core.h osr/src/
cp gdal-${GDAL_VER}/ogr/ogr_p.h osr/src/
cp gdal-${GDAL_VER}/ogr/ogr_geometry.h osr/src/
# cpl
cp gdal-${GDAL_VER}/port/*.h osr/src/
cp gdal-${GDAL_VER}/port/*.cpp osr/src/
rm osr/src/cpl_odbc.cpp
rm osr/src/cpl_vsil_gzip.cpp
rm osr/src/cpl_minizip_ioapi.cpp
rm osr/src/cpl_minizip_unzip.cpp
rm osr/src/cpl_minizip_zip.cpp
rm osr/src/cpl_win32ce_api.cpp
rm osr/src/vsipreload.cpp
rm osr/src/cpl_vsil_simple.cpp
rm osr/src/xmlreformat.cpp
rm osr/src/cpl_virtualmem.*
# patches
patch osr/src/ogr_srs_proj4.cpp < ogr_srs_proj4.diff
#patch osr/src/ogr_p.h < ogr_p.diff

# cleanup
rm -f osr/src/*.orig