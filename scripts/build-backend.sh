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

# Ensure we start in the right place
dir0="$( cd "$( dirname "$0" )" && pwd )"
repo_root="$(dirname "$dir0")"
cd "$repo_root"

echo "Setting up..."
mkdir -p ./nodejs-assets
rm -rf ./nodejs-assets/nodejs-project
rm -rf ./nodejs-assets/backend
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
# noderify does not realize that http2 and perf_hooks are built-in node modules
# pino-pretty is conditionally required by fastify, but we don't need it
# memcpy is a sub-dependency of the APK parser, but it is optional
"$(npm bin)/noderify" \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  --filter=rn-bridge \
  --filter=original-fs \
  --filter=async_hooks \
  --filter=utf-8-validate \
  --filter=bufferutil \
  --filter=http2 \
  --filter=pino-pretty \
  --filter=memcpy \
  --filter=diagnostics_channel \
  --filter=perf_hooks \
  index.js | \
  # Apologies to future contributors: this worker needs to load better-sqlite3,
  # and I could not get bindings() to correctly load the native code when this is
  # not at the project root. If the path name of the worker changes in the
  # original module then this replacement needs to be updated. Apologies for the
  # fragility, but this was the best solution I could find in limited time.
  sed 's|\.\./lib/mbtiles_import_worker\.js|../../../../../mbtiles_import_worker.js|' | \
  # Additional apologies for this, which is even more fragile. Context is that 
  # Piscina introduces its own worker file (unfortunately with a very generic name of `worker.js`)
  # so we need to update the path it references to point to the eventually relocated
  # file within the nodejs-project directory.
  sed "s|'worker\.js'|'../../../../piscina_worker.js'|" > \
  ../nodejs-project/index.js

# The worker in MapServer needs to be bundled separately, and we need to move it
# and search & replace the reference to the file in the main bundle so that all
# the paths resolve correctly
"$(npm bin)/noderify" \
  --replace.bindings=bindings-noderify-nodejs-mobile \
  node_modules/@mapeo/map-server/dist/lib/mbtiles_import_worker.js > \
  ../nodejs-project/mbtiles_import_worker.js \

# Piscina uses its own worker to initiate other workers, 
# so we need to bundle it seperately
"$(npm bin)/noderify" \
  node_modules/piscina/dist/src/worker.js > \
  ../nodejs-project/piscina_worker.js

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
declare -a keepThese=(
  # We need to leave this in place so that nodejs-mobile finds it and builds it
  "leveldown"
  ".bin"
  "node-gyp-build"
  "napi-macros"
  # These are static folders referenced by the mapserver code
  "@mapeo/map-server/prisma"
  "@mapeo/map-server/sdf"
  # We need to leave this in place so that nodejs-mobile finds it and builds it
  "better-sqlite3"
  # The hasha worker thread is not bundled by noderify, so we need to manually include it
  "hasha/thread.js"
)
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/backend/node_modules/$x" ]; then
    dest="./nodejs-assets/nodejs-project/node_modules/$x"
    mkdir -p "${dest%/*}"
    mv "./nodejs-assets/backend/node_modules/$x" "${dest}"
  fi
done

# Reduce apk size by removing leveldown prebuilds
rm -rf ./nodejs-assets/nodejs-project/node_modules/leveldown/prebuilds
echo -en " done.\n"

echo -en "Removing unused .bin aliases..."
find "./nodejs-assets/nodejs-project/node_modules/.bin" ! -iname "node-gyp-build*" \( -type f -o -type l \) -exec rm -f {} +
echo -en " done.\n"

echo -en "Cleanup..."
rm -rf ./nodejs-assets/backend
echo -en " done.\n"
