VERSION=$(shell jq -r .version < package.json)
APP=bohemiaautomation-evaics-app

all:
	@echo "Select target"

build:
	npm run build

pack:
	rm -rf $(APP)
	mv dist $(APP)
	rm -f $(APP)-$(VERSION).zip
	zip $(APP)-$(VERSION).zip $(APP) -r
	rm -rf $(APP)

clean:
	rm -rf $(APP)
	rm -rf dist
	rm -f *.zip
