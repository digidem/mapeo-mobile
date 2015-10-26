all: \
	lib/d3.js

clean:
	rm -f lib/d3.js

D3_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/geo/area.js \
	lib/d3.end.js

lib/d3.js: $(D3_FILES) lib/d3.end.js node_modules/.install
	node_modules/.bin/smash $(D3_FILES) > $@

node_modules/.install: package.json
	npm install && touch node_modules/.install
