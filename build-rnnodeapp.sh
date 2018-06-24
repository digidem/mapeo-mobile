#!/bin/bash

echo "Setting up...";
rm -rf ./rnnodeapp;
mkdir -p ./rnnodeapp;
if [ "$1" = "benchmark" ]; then
  cp -r ./benchmark/rnnodeapp ./;
else
  cp -r ./src/rnnodeapp ./;
fi

echo "Installing dependencies...";
cd ./rnnodeapp && npm i && cd ..;

echo "Minifying...";
$(npm bin)/noderify \
  --filter original-fs \
  --replace.leveldown=leveldown-android-prebuilt \
  ./rnnodeapp/index.js > ./rnnodeapp/_index.js;
rm ./rnnodeapp/index.js;
mv ./rnnodeapp/_index.js ./rnnodeapp/index.js;

echo "Setting up folder for native bindings...";
mv ./rnnodeapp/node_modules/leveldown-android-prebuilt/compiled ./rnnodeapp/compiled;

echo "Cleaning up...";
declare -a keepThese=("hyperlog" "osm-p2p-db-benchmark" "mapeo-styles")
for x in "${keepThese[@]}"
do
  if [ -e "./rnnodeapp/node_modules/$x" ]; then
    mv ./rnnodeapp/node_modules/$x ./rnnodeapp/$x;
  fi
done
rm -rf ./rnnodeapp/node_modules;
mkdir -p ./rnnodeapp/node_modules;
for x in "${keepThese[@]}"
do
  if [ -e "./rnnodeapp/$x" ]; then
    mv ./rnnodeapp/$x ./rnnodeapp/node_modules/$x;
  fi
done

echo "Bundling into Android...";
$(npm bin)/react-native-node insert ./rnnodeapp

echo "Done."
