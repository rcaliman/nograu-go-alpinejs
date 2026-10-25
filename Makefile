.PHONY: test build raspberry

test:
	go test ./...
	go vet ./...

build:
	CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o dist/nograu .

raspberry:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags='-s -w' -o dist/nograu-linux-arm64 .
	CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=7 go build -trimpath -ldflags='-s -w' -o dist/nograu-linux-armv7 .
