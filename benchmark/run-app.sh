#!/usr/bin/env bash
APK="$(pwd)/../android/app/build/outputs/apk/app-benchmark-release-unsigned.apk"
if [ -e "$APK" ]; then
    bundle exec calabash-android resign $APK
    bundle exec calabash-android run $APK
else
    echo "ERROR: you need to build the apk $APK before running tests."
fi
