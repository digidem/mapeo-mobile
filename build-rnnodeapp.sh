#!/bin/sh

echo "Setting up...";
mkdir -p ./rnnodeapp;
cp -r ./src/rnnodeapp ./;

echo "Installing dependencies...";
cd ./rnnodeapp && npm i && cd ..;

echo "Minifying...";
$(npm bin)/noderify ./rnnodeapp/main.js > ./rnnodeapp/index.js;
rm ./rnnodeapp/main.js;

echo "Cleaning up...";
rm -rf ./rnnodeapp/node_modules;

echo "Bundling into Android...";
$(npm bin)/react-native-node insert ./rnnodeapp

echo "Done."
