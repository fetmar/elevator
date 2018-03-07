#!/bin/bash

VERSION=$(grep "version" ./package.json | sed -e 's/.*"version".*\([0-9]\.[0-9]\.[0-9]\)".*/\1/')
BUILD_DATE=$(date --date="Feb 2 2014 13:12:10")

docker build -t fetmar/elevator:latest . \
  --build-arg VCS_REF=`git rev-parse --short HEAD`
  --build-arg VERSION=$VERSION
  --build-arg BUILD_DATE=$BUILD_DATE


docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push fetmar/elevator:latest
