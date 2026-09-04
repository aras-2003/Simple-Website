.PHONY: build test chatgpt-test dev mac-demo mac-stop browser-test docker-build docker-run mac-docker docker-down k8s-local k8s-local-down k8s-render clean

build:
	python3 scripts/build.py

test:
	bash scripts/test.sh

chatgpt-test:
	bash scripts/chatgpt-test.sh

dev:
	bash scripts/dev.sh

mac-demo:
	bash scripts/mac-demo.sh

mac-stop:
	bash scripts/mac-stop.sh

browser-test:
	bash scripts/browser-test.sh

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
	rm -rf dist artifacts rendered-k8s.yaml rendered-k8s-local.yaml .local-server.pid .local-server.log .k8s-port-forward.pid .k8s-port-forward.log
