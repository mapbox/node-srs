rm -rf osr
mkdir -p osr
cp main.scons osr/SConstruct
cd osr
svn co https://svn.osgeo.org/gdal/trunk/gdal/port
cp ../port.scons port/SConscript
svn co https://svn.osgeo.org/gdal/trunk/gdal/ogr
rm -rf ogr/ogrsf_frmts
rm -rf ogr/wcts
cp ../ogr.scons ogr/SConscript
wget http://svn.osgeo.org/gdal/trunk/gdal/gcore/gdal_version.h
cp gdal_version.h ogr/gdal_version.h