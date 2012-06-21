all: srs.node

NPROCS:=1
OS:=$(shell uname -s)

ifeq ($(OS),Linux)
	NPROCS:=$(shell grep -c ^processor /proc/cpuinfo)
endif
ifeq ($(OS),Darwin)
	NPROCS:=$(shell sysctl -n hw.ncpu)
endif

install: all
	node-waf -v build install

srs.node:
	node-waf -v build

clean:
	node-waf -v clean distclean

uninstall:
	node-waf -v uninstall

test:
	@NODE_PATH=./lib:$NODE_PATH expresso

check: test

lint:
	@jshint lib/*js test/*js --config=jshint.json

gyp:
	rm -rf ./projects/makefiles/
	python gyp/gyp build.gyp --depth=. -f make --generator-output=./projects/makefiles
	make -j$(NPROCS) -C ./projects/makefiles/ V=1
	cp projects/makefiles/out/Default/_srs.node lib/_srs.node

.PHONY: test gyp
