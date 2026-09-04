.PHONY: build test chatgpt-test dev browser-test docker-build docker-run k8s-render clean

build:
	python3 scripts/build.py

test:
	bash scripts/test.sh

chatgpt-test:
	bash scripts/chatgpt-test.sh

dev:
	bash scripts/dev.sh

browser-test:
	bash scripts/browser-test.sh

docker-build:
	docker build -t arkadiusz-kamrowski-site:local .

docker-run:
	bash scripts/docker-run.sh

k8s-render:
	python3 scripts/render-k8s.py --image "$${IMAGE:?set IMAGE}" --host "$${HOST:?set HOST}"

clean:
	rm -rf dist artifacts rendered-k8s.yaml
