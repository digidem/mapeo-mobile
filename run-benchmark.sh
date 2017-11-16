#!/bin/sh

# Build the background Node.js process containing only tests
./build-rnnodeapp.sh benchmark && \
  # Clean the React Native JavaScript app
  watchman watch-del-all && rm -rf $TMPDIR/react-* && \
  # Build the React Native Android app for benchmarking
  cd android && ./gradlew clean && ./gradlew assembleBenchmarkRelease && cd .. && \
  # Run automated test that verifies the benchmark results
  cd benchmark && ./run-app.sh && cd ..;
