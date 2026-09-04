.PHONY: install build check test test-a11y audit dev mac-demo mac-stop browser-test docker-build docker-run mac-docker docker-down k8s-local k8s-local-down k8s-render clean

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

audit: test test-a11y

dev:
	bash scripts/dev.sh

mac-demo:
	bash scripts/mac-demo.sh

mac-stop:
	bash scripts/mac-stop.sh

browser-test: test-a11y

docker-build:
	docker build -t arkadiusz-kamrowski-site:local .

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
	python3 scripts/render-k8s.py --image "$${IMAGE:?set IMAGE}" --host "$${HOST:?set HOST}"

clean:
	rm -rf dist node_modules .astro artifacts rendered-k8s.yaml rendered-k8s-local.yaml .local-server.pid .local-server.log .k8s-port-forward.pid .k8s-port-forward.log
