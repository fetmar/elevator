#!/bin/bash
# This script generates the html output and opens a browser window for you to view it.

npx jsdoc elevator.js -c ./jsdoc.json

if [ ! -z `which open` ]; then
  opener=open
elif [ ! -z `which start` ]; then
  opener=start
elif [ ! -z `which xdg-open` ]; then
  opener=xdg-open
fi

$opener file://$PWD/jsdoc/index.html
