#!/bin/bash

# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

set -eEu -o pipefail
shopt -s extdebug
IFS=$'\n\t'
trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

# "NDK_ARCH;NODEJS_ARCH"
declare -a archs=(
  "armeabi-v7a;arm"
  # "arm64-v8a;arm64"
  # "x86;x86"
  # "x86_64;x64"
)

NODE_VERSION=10.13.0   # This is given by nodejs-mobile
NODE_MODULE_VERSION=64 # See https://nodejs.org/en/download/releases

echo "Setting up..."
mkdir -p ./nodejs-assets
rm -rf ./nodejs-assets/nodejs-project
# if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]; then
#   echo "Build Native Modules on"
# else
#   echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt
#   echo "Set Build Native Modules on"
# fi
cp -r ./src/backend ./nodejs-assets
mv ./nodejs-assets/backend ./nodejs-assets/nodejs-project
cp ./src/backend/package.json ./nodejs-assets/nodejs-project
cp ./src/backend/package-lock.json ./nodejs-assets/nodejs-project
# rm ./nodejs-assets/nodejs-project/*.js.map
# rm ./nodejs-assets/nodejs-project/plugins/*.js.map

echo "Installing dependencies..."
cd ./nodejs-assets/nodejs-project && npm install --no-optional

# For more details on this, read issue
# https://gitlab.com/staltz/manyverse/issues/398
# mapeo backend doesn't currently use these deps, but leaving this here in case
# we add them in the future and it would break builds on mac
echo "Removing problematic transitive dependencies..."
cd node_modules && rm -rf chokidar fsevents && cd ../../..

cd android
if [ -f ./gradlew ]; then
  GRADLE_EXEC="./gradlew"
else
  GRADLE_EXEC="gradle"
fi
echo $GRADLE_EXEC
for entry in "${archs[@]}"; do
  IFS=";" read -r -a arr <<<"${entry}" # entry.split(';')
  arch="${arr[0]}"

  echo "Building native modules for $arch..."
  $GRADLE_EXEC nodejs-mobile-react-native:GenerateNodeNativeAssetsLists$arch
done
cd ..
echo ""

echo -en "Minifying with noderify..."
cd ./nodejs-assets/nodejs-project
"$(npm bin)/noderify" \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  --filter=rn-bridge \
  --filter=original-fs \
  index.js >_index.js
rm index.js
mv _index.js index.js
cd ../..
echo -en " done.\n"

echo -en "Create presets fallback folder"
cd ./nodejs-assets/nodejs-project
mkdir -p presets
mv ./node_modules/mapeo-default-settings/build ./presets/default
cd ../..
echo -en " done.\n"

echo -en "Removing node_modules folder"
rm -rf ./nodejs-assets/nodejs-project/node_modules
echo -en " done.\n"

echo -en "Removing other unused files..."
rm ./nodejs-assets/nodejs-project/package-lock.json
# make a list of things to delete then delete them
# `-exec rm -rf {} \;` confuses find because the recursion can no longer find a step (depth-first traversal (-d) would also work)
# GNU find and modern BSD/macOS find have a `-delete` operator
find ./nodejs-assets/nodejs-project \
  -type d \
  \( \
  -name "darwin-x64" \
  -o -name "win32-ia32" \
  -o -name "win32-x64" \
  \) \
  -print0 | xargs -0 rm -rf # delete everything in the list
echo -en " done.\n"
