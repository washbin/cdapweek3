# syntax=docker/dockerfile:1

FROM golang:1.16-buster AS build

RUN update-ca-certificates
WORKDIR /go/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN CGO_ENABLED=0 GOOS=linux \
	 go build -ldflags="-w -s" \
	 -a -installsuffix cgo \
	 -o /go/bin/app .

FROM gcr.io/distroless/static

COPY --from=build /go/bin/app /go/bin/app
ENTRYPOINT ["/go/bin/app"]
