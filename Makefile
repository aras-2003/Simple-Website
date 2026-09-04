.PHONY: build test chatgpt-test dev browser-test docker-build docker-run k8s-render clean

build:
	./scripts/build.py

test:
	./scripts/test.sh

chatgpt-test:
	./scripts/chatgpt-test.sh

dev:
	./scripts/dev.sh

browser-test:
	./scripts/browser-test.sh

docker-build:
	docker build -t arkadiusz-kamrowski-site:local .

docker-run:
	./scripts/docker-run.sh

k8s-render:
	python3 scripts/render-k8s.py --image "$${IMAGE:?set IMAGE}" --host "$${HOST:?set HOST}"

clean:
	rm -rf dist artifacts rendered-k8s.yaml
