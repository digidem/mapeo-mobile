#!/bin/bash

set -eEu -o pipefail
shopt -s extdebug
IFS=$'\n\t'
trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

dir0="$( cd "$( dirname "$0" )" && pwd )"; #absolute starting dir
android_dir="$(dirname "$dir0")/android"
apk_dir="${android_dir}/app/build/outputs/apk/qa/release"

build_apk () {
  cd "$android_dir"
  ANDROID_VERSION_NAME=$1
  ANDROID_VERSION_CODE=$2
  export ANDROID_VERSION_NAME
  export ANDROID_VERSION_CODE
  ./gradlew assembleQaRelease
  mv "$apk_dir/mapeo-qa-release.apk" "$apk_dir/mapeo-v${1}.${2}.apk"
}

# Build backend
"${dir0}/build-backend.sh"

# Build a QA Release APK with version name and version code
build_apk 5.3.0 2030
build_apk 5.4.0 2040
build_apk 6.0.0 2050

echo "Test APKs generated in ${apk_dir}"
