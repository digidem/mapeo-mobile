#!/bin/bash
echo "Setting up...";
rm -rf ./nodejs-assets/nodejs-project;
mkdir -p ./nodejs-assets/nodejs-project;
if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]
then
  echo "Build Native Modules is already enabled.";
else
  echo "Enabling Build Native Modules...";
  echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt;
fi
if [ "$1" = "benchmark" ]; then
  cp -r ./benchmark/nodejs-project ./nodejs-assets;
  cp ./benchmark/nodejs-project/package.json ./nodejs-assets/nodejs-project;
else
  cp -r ./src/nodejs-project ./nodejs-assets;
  cp ./src/nodejs-project/package.json ./nodejs-assets/nodejs-project;
fi

echo "Installing dependencies...";
cd ./nodejs-assets/nodejs-project && npm i && cd ../..;

if [ "$1" = "benchmark" ]; then
  echo "Updating package-lock.json...";
  cp ./nodejs-assets/nodejs-project/package-lock.json ./benchmark/nodejs-project/package-lock.json

  echo "Deleting some unnecessary (and troublesome) node modules...";
  rm -rf ./nodejs-assets/nodejs-project/node_modules/tape/node_modules/resolve/test;
  rm -rf ./nodejs-assets/nodejs-project/node_modules/level-sublevel/_test/;
  rm -rf ./nodejs-assets/nodejs-project/node_modules/resolve/test;

  echo "Done.";
  exit 0;
fi

echo "Building native modules for armeabi-v7a...";
cd android;
./gradlew nodejs-mobile-react-native:GenerateNodeNativeAssetsListsarmeabi-v7a
cd ..;
echo "";

echo "Minifying...";
cd ./nodejs-assets/nodejs-project;
$(npm bin)/noderify \
  --filter original-fs \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  ./main.js > ./_main.js;
rm ./main.js;
mv ./_main.js ./main.js;
cd ../..;

echo "Compacting node_modules folder...";
declare -a keepThese=("hyperlog" "osm-p2p-db-benchmark" "mapeo-styles")
for x in "${keepThese[@]}"
do
  if [ -e "./nodejs-assets/nodejs-project/node_modules/$x" ]; then
    mv ./nodejs-assets/nodejs-project/node_modules/$x ./nodejs-assets/$x;
  fi
done
rm -rf ./nodejs-assets/nodejs-project/node_modules;
cp -r ./android/build/nodejs-native-assets/nodejs-native-assets-armeabi-v7a/node_modules ./nodejs-assets/nodejs-project;
for x in "${keepThese[@]}"
do
  if [ -e "./nodejs-assets/$x" ]; then
    mv ./nodejs-assets/$x ./nodejs-assets/nodejs-project/node_modules/$x;
  fi
done

echo "Updating package-lock.json...";
cp ./nodejs-assets/nodejs-project/package-lock.json ./src/nodejs-project/package-lock.json

echo "Done."
