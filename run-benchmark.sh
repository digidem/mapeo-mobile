#!/bin/bash

# Build the background Node.js process containing only tests
./build-rnnodeapp.sh benchmark && \
  # Clean the React Native JavaScript app
  if [ -x "$(command -v watchman)" ]; then watchman watch-del-all && rm -rf $TMPDIR/react-*; fi && \
  # Build the React Native Android app for benchmarking
  cd android && ./gradlew clean && ./gradlew assembleBenchmarkDebug && cd .. && \
  # Run automated test that verifies the benchmark results
  node ./benchmark/test.js;
