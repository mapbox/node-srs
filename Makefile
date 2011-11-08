all: srs.node

install: all
	node-waf -v build install

srs.node:
	node-waf -v build

clean:
	node-waf -v clean distclean

uninstall:
	node-waf -v uninstall

test:
	@NODE_PATH=.:./lib:$NODE_PATH expresso

lint:
	@jshint lib/*js test/*js --config=jshint.json

.PHONY: test
