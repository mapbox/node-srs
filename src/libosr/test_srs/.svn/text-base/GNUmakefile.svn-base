# Makefile for libOSR test program
#
# $Id: $
#

include ../GNUmake.opt

INCLUDE :=	-I../ogr $(INCLUDE)

#
#  
#

LIBS =	../ogr/ogr.a ../cpl/cpl.a

default: test_srs



test_srs: test_srs.o $(LIBS)
	$(CXX) $(LFLAGS) -o test_srs test_srs.o $(LIBS) -lm 


../cpl/cpl.a:
	(cd ../cpl; make)

../ogr/ogr.a:
	(cd ../ogr; make)

clean:
	rm -f test_srs test_srs.o
