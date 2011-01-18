#
# CPL (Common Portability Library) makefile
#

OBJ	=	cpl_conv.o cpl_error.o cpl_string.o cpl_vsisimple.o \
		cplgetsymbol.o cpl_path.o cpl_csv.o cpl_findfile.o \
		cpl_minixml.o cpl_vsil.o cpl_vsi_mem.o \
		cpl_vsil_unix_stdio_64.o cpl_multiproc.o cplstring.o \
		cpl_getexecpath.o cpl_http.o cpl_atomic_ops.o \
		cpl_strtod.o

LIB	=	cpl.a

include ../GNUmake.opt

default:	cpl_config.h $(LIB)

clean:
	rm -f *.o $(LIB)

cpl_config.h:	cpl_config.h.in
	cp cpl_config.h.in cpl_config.h

$(LIB): $(OBJ)
	rm -f $(LIB)
	$(AR) rc $(LIB) $(OBJ)
	ranlib $(LIB)

dist:	clean
	rm -f $(HOME)/cpl.zip
	(cd ..; zip $(HOME)/cpl.zip ./cpl/cpl*.cpp ./cpl/cpl*.h \
			./cpl/README.* ./cpl/cpl_config.h.* )
	echo Built $(HOME)/cpl.zip

