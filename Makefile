.PHONY: install build build-local check test test-a11y test-contact audit dev contact-dev contact-api mac-demo mac-stop browser-test docker-build docker-run mac-docker docker-down k8s-local k8s-local-down k8s-render clean

install:
	npm ci --no-audit --no-fund

build:
	npm run build

build-local:
	npm run build:local

check:
	npm run check

test:
	bash scripts/test.sh

test-a11y:
	npx playwright install chromium firefox webkit
	npm run test:a11y

test-contact:
	npm run test:contact

contact-api:
	CONTACT_DRY_RUN=$${CONTACT_DRY_RUN:-1} node server/contact.mjs

contact-dev: contact-api

audit: test test-a11y

dev:
	bash scripts/dev.sh

mac-demo:
	bash scripts/mac-demo.sh

mac-stop:
	bash scripts/mac-stop.sh

browser-test: test-a11y

docker-build:
	docker build --build-arg SITE_BASE_URL=http://localhost:8080 --build-arg ALLOW_LOCAL_SITE_BASE=1 -t arkadiusz-kamrowski-site:local .
	docker build -f server/Dockerfile -t arkadiusz-kamrowski-contact:local .

docker-run:
	bash scripts/docker-run.sh

mac-docker:
	bash scripts/mac-docker.sh

docker-down:
	docker compose down

k8s-local:
	bash scripts/k8s-local.sh up

k8s-local-down:
	bash scripts/k8s-local.sh down

k8s-render:
	python3 scripts/render-k8s.py --image "$${IMAGE:?set IMAGE}" --contact-image "$${CONTACT_IMAGE:?set CONTACT_IMAGE}" --host "$${HOST:?set HOST}"

clean:
	rm -rf dist node_modules .astro artifacts rendered-k8s.yaml rendered-k8s-local.yaml .local-server.pid .local-server.log .contact-api.pid .contact-api.log .k8s-port-forward.pid .k8s-port-forward.log
