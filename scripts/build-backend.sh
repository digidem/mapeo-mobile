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

echo "Setting up..."
mkdir -p ./nodejs-assets
rm -rf ./nodejs-assets/nodejs-project
if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]; then
  echo "Build Native Modules on"
else
  echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt
  echo "Set Build Native Modules on"
fi
cp -r ./src/backend ./nodejs-assets
mkdir -p ./nodejs-assets/nodejs-project/node_modules

echo "Installing dependencies..."
cd ./nodejs-assets/backend && npm ci

echo -en "Minifying with noderify..."
# https://github.com/digidem/mapeo-mobile/issues/521
"$(npm bin)/noderify" \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  --filter=rn-bridge \
  --filter=original-fs \
  --filter=async_hooks \
  --filter=utf-8-validate \
  --filter=bufferutil \
  index.js > ../nodejs-project/index.js
cd ../..
echo -en " done.\n"

echo -en "Keeping whitelisted files..."
declare -a keepThese=("package.json" "loader.js")
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/backend/$x" ]; then
    mv "./nodejs-assets/backend/$x" "./nodejs-assets/nodejs-project/$x"
  fi
done
echo -en " done.\n"

echo -en "Create presets fallback folders..."
ANDROID_SRC_DIR="$(pwd)/android/app/src"
cd ./nodejs-assets/backend
# We use a patched version of nodejs-mobile-react-native that extracts files in
# the assets/nodejs-assets folder, so that they are accessible to Node. Here we
# copy default presets into assets folders by variant, so that the icca variant
# has its own custom presets shipped with the app.
rm -rf "${ANDROID_SRC_DIR}/main/assets/nodejs-assets/presets"
rm -rf "${ANDROID_SRC_DIR}/icca/assets/nodejs-assets/presets"
mkdir -p "${ANDROID_SRC_DIR}/main/assets/nodejs-assets/presets"
mkdir -p "${ANDROID_SRC_DIR}/icca/assets/nodejs-assets/presets"
mv ./node_modules/mapeo-default-settings/dist "${ANDROID_SRC_DIR}/main/assets/nodejs-assets/presets/default"
mv ./node_modules/mapeo-config-icca/dist "${ANDROID_SRC_DIR}/icca/assets/nodejs-assets/presets/default"
cd ../..
echo -en " done.\n"

echo -en "Keeping some node modules..."
declare -a keepThese=("leveldown" ".bin" "node-gyp-build" "napi-macros")
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/backend/node_modules/$x" ]; then
    mv "./nodejs-assets/backend/node_modules/$x" "./nodejs-assets/nodejs-project/node_modules/$x"
  fi
done
echo -en " done.\n"

echo -en "Removing unused .bin aliases..."
find "./nodejs-assets/nodejs-project/node_modules/.bin" ! -iname "node-gyp-build*" \( -type f -o -type l \) -exec rm -f {} +
echo -en " done.\n"

echo -en "Cleanup..."
rm -rf ./nodejs-assets/backend
echo -en " done.\n"
