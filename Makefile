lint:
	npx eslint .
test:
	npx jest
setup:
	npm ci
test-coverage:
	npm test -- --coverage --coverageProvider=v8
install: setup
	npm link
