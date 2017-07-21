.PHONY: default sample test patch minor

default:

sample:
	node index.js compile test/test.html > test/test.json

test:
	node index.js compile test/test.html | cmp test/test.json && echo success

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public
