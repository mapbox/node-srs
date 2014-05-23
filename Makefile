all: srs.node

NPROCS:=1
OS:=$(shell uname -s)

ifeq ($(OS),Linux)
	NPROCS:=$(shell grep -c ^processor /proc/cpuinfo)
endif
ifeq ($(OS),Darwin)
	NPROCS:=$(shell sysctl -n hw.ncpu)
endif

srs.node:
	`npm explore npm -g -- pwd`/bin/node-gyp-bin/node-gyp build

32:
	# note: requires FAT (aka duel 32 bit and 54 bit arch) node binary from .pkg
	`npm explore npm -g -- pwd`/bin/node-gyp-bin/node-gyp configure build --target_arch=ia32
	arch -i386 /usr/local/bin/node ./node_modules/.bin/_mocha


clean:
	rm -rf build
	rm -rf lib/binding

test:
	@PATH="./node_modules/mocha/bin:${PATH}" && NODE_PATH="./lib:$(NODE_PATH)" mocha -R spec

check: test

lint:
	@jshint lib/*js test/*js --config=jshint.json

.PHONY: test
