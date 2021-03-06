#!/bin/bash
# These are run after the tests.
# Errors here won't show as a failed build.

# Only build for master
if [ "$TRAVIS_BRANCH" != "master" ]; then
  exit 0
fi

# get variables ready
VERSION=$(grep "version" ./package.json | sed -e 's/.*"version".*\([0-9]\.[0-9]\.[0-9]\)".*/\1/')
BUILD_DATE=$(date --date="Feb 2 2014 13:12:10")
COMMIT=$(git rev-parse --short HEAD)

# docker login
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"

# make an image
docker build -t fetmar/elevator:latest . \
  --build-arg VCS_REF="$COMMIT" \
  --build-arg VERSION="$VERSION" \
  --build-arg BUILD_DATE="$BUILD_DATE"

# push latest image
docker push fetmar/elevator:"$VERSION"

# push a versioned image
docker tag fetmar/elevator:latest fetmar/elevator:"$VERSION"
docker push fetmar/elevator:latest
