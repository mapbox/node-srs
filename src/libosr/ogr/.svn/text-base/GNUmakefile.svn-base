#
# CPL (Common Portability Library) makefile
#

OBJ	=	ogr_srsnode.o ogrspatialreference.o \
		ogr_srs_proj4.o ogr_srs_xml.o ogr_srs_esri.o \
		ogr_srs_dict.o ogr_fromepsg.o ogrct.o

LIB	=	ogr.a

include ../GNUmake.opt

default:	$(LIB)

clean:
	rm -f *.o $(LIB)

$(LIB): $(OBJ)
	rm -f $(LIB)
	$(AR) rc $(LIB) $(OBJ)
	ranlib $(LIB)
