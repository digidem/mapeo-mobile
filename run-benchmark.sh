#!/bin/bash
set -e

#
# Note: this script is intended to run on a development computer,
# not in continuous integration (Travis)
#

# Build the background Node.js process containing only tests
./build-nodejs-project.sh benchmark

# Clean the React Native JavaScript app
watchman watch-del-all && rm -rf $TMPDIR/react-*

# Build the React Native Android app for benchmarking
cd android
./gradlew clean
./gradlew assembleBenchmarkDebug
cd ..

# Start Appium server
$(npm bin)/appium > appium.log & echo $! > appium-server.pid
sleep 8

# Run automated test that verifies the benchmark results
node ./benchmark/test.js

# Stop Appium server
if ps -p $(cat appium-server.pid)> /dev/null; then
  kill -KILL $(cat appium-server.pid);
fi
rm appium-server.pid
rm appium.log
