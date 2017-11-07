#!/bin/sh

echo "Setting up...";
mkdir -p ./rnnodeapp;
cp -r ./src/rnnodeapp ./;

echo "Installing dependencies...";
cd ./rnnodeapp && npm i && cd ..;

echo "Minifying...";
$(npm bin)/noderify \
  --replace.leveldown=memdown \
  --replace.fd-chunk-store=memory-chunk-store \
  ./rnnodeapp/main.js > ./rnnodeapp/index.js;
rm ./rnnodeapp/main.js;

echo "Cleaning up...";
declare -a keepThese=("hyperlog")
for x in "${keepThese[@]}"
do
  mv ./rnnodeapp/node_modules/$x ./rnnodeapp/$x;
done
rm -rf ./rnnodeapp/node_modules;
mkdir -p ./rnnodeapp/node_modules;
for x in "${keepThese[@]}"
do
  mv ./rnnodeapp/$x ./rnnodeapp/node_modules/$x;
done

echo "Bundling into Android...";
$(npm bin)/react-native-node insert ./rnnodeapp

echo "Done."
