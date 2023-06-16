VERSION=$(shell jq -r .version < package.json)
APP=bohemiaautomation-evaics-app

all:
	@echo "Select target"

build:
	npm install
	npm run build

pack:
	rm -rf $(APP)
	mv dist $(APP)
	rm -f $(APP)-$(VERSION).zip
	zip $(APP)-$(VERSION).zip $(APP) -r
	rm -rf $(APP)

pub:
	rci x eva.app.grafana

upload:
	gsutil cp -a public-read $(APP)-$(VERSION).zip gs://pub.bma.ai/evaics-app-grafana/
	rci job run pub.bma.ai

clean:
	rm -rf $(APP)
	rm -rf dist
	rm -f *.zip

doc:
	cp ./src/README.md .
