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

cp osr/port/cpl_conv.* osr/src/
cp osr/port/cpl_error.* osr/src/
cp osr/port/cpl_string.* osr/src/
cp osr/port/cplstring.* osr/src/
cp osr/port/cplstringlist.* osr/src/
cp osr/port/cpl_vsisimple.* osr/src/
cp osr/port/cpl_http.* osr/src/
cp osr/port/cplgetsymbol.* osr/src/
cp osr/port/cpl_multiproc.* osr/src/
cp osr/port/cpl_csv.* osr/src/
cp osr/port/cpl_findfile.* osr/src/
cp osr/port/cpl_path.* osr/src/
cp osr/port/cpl_vsil_unix_stdio_64.* osr/src/
cp osr/port/cpl_strtod.* osr/src/
cp osr/port/cpl_port.h osr/src/
cp osr/port/cpl_vsi.h osr/src/
cp osr/port/gdal_csv.h osr/src/
cp osr/port/cpl_vsi_virtual.h osr/src/
cp osr/port/cpl_minixml.h osr/src/
cp osr/port/cpl_atomic_ops.h osr/src/
cp osr/port/ osr/src/
cp osr/port/ osr/src/
cp osr/port/ osr/src/
cp osr/port/ osr/src/
cp osr/port/ osr/src/
