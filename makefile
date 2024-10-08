lint:
	pnpm run eslint

lint+fix:
	pnpm run eslint:fix

.PHONY: test
test: build test-unit

test-unit:
	pnpm run test:unit

snapshots:
	pnpm run test:snapshots

typecheck:
	pnpm run typecheck

clean:
	pnpm run clean

copy-templates:
	mkdir -p ./dist/templates
	cp -a ./src/templates/. ./dist/templates

check: typecheck lint test

.PHONY: build
build: typecheck clean copy-templates
	pnpm run build
	rm -rf ./dist/*.spec.js ./dist/**/*.spec.js ./dist/**/__mocks__

dist: build

i:
	rm -rf node_modules
	pnpm i

publish: dist bump
	pnpm publish --access public

bump:
	npm version patch
	git add .