WRANGLER_VERSION ?= 4.129.0

.PHONY: install build check test test-a11y test-contact test-worker test-predeploy audit predeploy smoke-production dev contact-dev contact-api mac-demo mac-stop browser-test worker-preview worker-deploy-production portability-docker-build docker-run mac-docker docker-down k8s-local k8s-local-down k8s-render clean

install:
	npm install --no-audit --no-fund

build:
	npm run build

check:
	npm run check

test:
	bash scripts/test.sh

test-a11y:
	npx playwright install chromium
	npm run test:a11y

test-contact:
	npm run test:contact

test-worker:
	npm run test:worker

test-predeploy:
	npm run test:predeploy

predeploy:
	python3 scripts/predeploy_check.py \
		--site-base-url "$${SITE_BASE_URL:?set SITE_BASE_URL}" \
		--host "$${SITE_PRODUCTION_HOST:?set SITE_PRODUCTION_HOST}" \
		--require-contact-production

smoke-production:
	SITE_BASE_URL="$${SITE_BASE_URL:-https://arkadiuszkamrowski.com}" node scripts/production-smoke.mjs

# Cloudflare Workers is the production runtime. Preview keeps workers.dev enabled;
# production uses the custom apex domain declared in wrangler.production.jsonc.
worker-preview: build
	npx --yes wrangler@$(WRANGLER_VERSION) deploy --config wrangler.jsonc

worker-deploy-production: predeploy build
	npx --yes wrangler@$(WRANGLER_VERSION) deploy --config wrangler.production.jsonc

# Legacy Node/NGINX/container path retained only as a portability/reference harness.
contact-api:
	CONTACT_DRY_RUN=$${CONTACT_DRY_RUN:-1} node server/contact.mjs

audit: test test-a11y

dev:
	bash scripts/dev.sh

contact-dev:
	npm run contact:dev

mac-demo:
	bash scripts/mac-demo.sh

mac-stop:
	bash scripts/mac-stop.sh

browser-test: test-a11y

portability-docker-build:
	docker build -t arkadiusz-kamrowski-site:local .
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
