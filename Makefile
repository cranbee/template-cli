.PHONY: default install sample test clean patch minor

default: install

install:
	npm install
	npm update

sample:
	node index.js compile test/test.html > test/test.json

test:
	node index.js compile test/test.html | cmp test/test.json && echo success

clean:
	rm -rf node_modules
	rm -f package-lock.json

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public
