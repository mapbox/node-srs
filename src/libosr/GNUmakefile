#
# Unix makefile to build the libOSR library and test programs
#


default:	all

all:
	(cd cpl; $(MAKE))
	(cd ogr; $(MAKE))
	(cd test_srs; $(MAKE))

clean:
	(cd cpl; $(MAKE) clean)
	(cd ogr; $(MAKE) clean)
	(cd test_srs; $(MAKE) clean)

