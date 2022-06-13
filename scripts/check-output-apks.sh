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
apk_dir="$repo_root/android/app/build/outputs/apk"
apk_files="$( find "$apk_dir" -name "*.apk" )"

for apk in $apk_files; do
  node "${dir0}/check-apk-assets.js" "$apk"
done
