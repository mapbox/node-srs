all: srs

srs:
	PATH=`npm explore npm -g -- pwd`/bin/node-gyp-bin:./node_modules/.bin:$${PATH} && ./node_modules/.bin/node-pre-gyp build

clean:
	@rm -rf ./build
	rm -rf lib/binding/
	rm -f test/tmp/*
	rm -rf ./build
	rm -rf ./out

rebuild:
	@make clean
	@./configure
	@make

test:
	@PATH=./node_modules/mocha/bin:${PATH} && NODE_PATH=./lib:$NODE_PATH mocha -R spec

.PHONY: test