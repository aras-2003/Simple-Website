.PHONY: install build check test test-a11y test-contact test-predeploy audit predeploy smoke-production dev contact-dev contact-api mac-demo mac-stop browser-test docker-build docker-build-production docker-run mac-docker docker-down k8s-local k8s-local-down k8s-render clean

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

test-predeploy:
	npm run test:predeploy

predeploy:
	python3 scripts/predeploy_check.py \
		--site-base-url "$${SITE_BASE_URL:?set SITE_BASE_URL}" \
		--host "$${HOST:?set HOST}" \
		--namespace "$${NAMESPACE:-personal-site}" \
		--require-contact-production

smoke-production:
	SITE_BASE_URL="$${SITE_BASE_URL:-https://arkadiuszkamrowski.com}" node scripts/production-smoke.mjs

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

docker-build:
	docker build -t arkadiusz-kamrowski-site:local .
	docker build -f server/Dockerfile -t arkadiusz-kamrowski-contact:local .

docker-build-production: predeploy
	docker build \
		--build-arg SITE_BASE_URL="$${SITE_BASE_URL}" \
		--build-arg SITE_PRODUCTION_HOST="$${HOST}" \
		--build-arg REQUIRE_PRODUCTION_SITE=1 \
		-t "$${IMAGE:?set IMAGE to an immutable production tag}" .
	docker build -f server/Dockerfile \
		-t "$${CONTACT_IMAGE:?set CONTACT_IMAGE to an immutable production tag}" .

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
