# mapeo-mobile

[![Build Status](https://app.bitrise.io/app/288e6b3c3069b8e6/status.svg?token=WQq3QO2MrSbNUnr4mfO8gQ&branch=master)](https://app.bitrise.io/app/288e6b3c3069b8e6)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Monitor and document the world around you

Mapeo Mobile is a mobile app (currently Android only) for offline mapping and monitoring.

## Table of Contents

- [Compatibility & Stability](#-Compatibility)
- [Install](#install)
- [Usage](#usage)
- [Translations](#translations)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## ⚠ Compatibility & Stability

**Mapeo Mobile v2 is unable to sync with Mapeo Mobile v1**, due to a change in the way synchronization works. You will need to update all devices to v2 or higher in order to continue syncing.

Due to this sync change, **Mapeo Mobile v2 is also unable to sync with Mapeo Desktop v4 or v3**. You will need to update Mapeo Desktop to v5 or higher in order to continue syncing.

Mapeo Mobile is currently in Beta. This means that there might be frequent changes to the user interface and there may be changes that break the ability to sync with older versions unless every device updates. We understand that this is an inconvenience if many users are offline and unable to update more easily, and when the sync protocol is more stable we will move Mapeo out of beta and work on a way of updating offline clients offline during sync.

Mapeo Mobile is already being used in the field with dozens of local community partners and is stable and reliable enough for real-world usage, and we work hard to ensure that no data is lost during updates.

You will also see Alpha releases on the releases page. These should be regarded as unstable and likely to crash / not work. We use the Alpha releases for internal testing and once it is stable enough we release it as a Beta. If you don't mind things breaking we really welcome others being able to test the latest Alpha and sending us feedback about any bugs you find.

## Install

Download the [latest release](https://github.com/digidem/mapeo-mobile/releases)
APK file and [install manually](https://www.wikihow.com/Install-APK-Files-from-a-PC-on-Android) on your Android phone.

## Usage

### Custom presets

Presets must be placed in this folder:

```txt
/sdcard/Android/data/com.mapeo/files/presets/default
```

This folder (`default`) should contain these files directly in under this
`default` folder (i.e. no sub-folder with a different name):

```txt
presets.json
icons/
  myIcon-medium@1x.png
  myIcon-medium@2x.png
  myIcon-medium@3x.png
  ...etc
```

### Offline Maps

First find out the bouding box of the map area that will be downloaded using the [boundingbox online tool](https://boundingbox.klokantech.com). Use the `CSV` Copy & Paste option to display the coordinates in the correct format.

Then install [mapbox-style-downloader](https://www.npmjs.com/package/mapbox-style-downloader):

```sh
npm i -g mapbox-style-downloader
```

Get a [Mapbox API token](https://account.mapbox.com/access-tokens/) and select a [Mapbox style](https://docs.mapbox.com/api/maps/styles/).

Use `mapbox-style-downloader` to download styles, tiles, glyphs, and sprites for offline use:

```sh
mapbox-style download mapbox://styles/mapbox/streets-v9 \
  --asar \
  --token='MAPBOX_API_TOKEN' \
  -o styledir \
  -z 8 \
  -Z 13 \
  -b '-60.1364 1.5626 -58.0627 3.475'
```

Check that everything was downloaded correctly with `mapbox-style serve` inside the `styledir` directory.

Connect phone to computer or move the files to a SD card or USB drive (an adapter will be needed).

Offline maps must be placed in this folder:

```txt
/sdcard/Android/data/com.mapeo/files/styles/default
```

> ⚠ with different mapeo releases `com.mapeo` changes, ex.: `com.mapeo.debug`

From the computer `adb push` can be used. Make sure you have [adb](https://adbinstaller.com/) installed. Use like so:

```sh
adb push /path/to/styledir/* /sdcard/Android/data/com.mapeo/files/styles/default
```

This folder should contain these files directly under this `default` folder:

```txt
style.json
fonts/
tiles/
  my-offline-tiles.asar
  ...maybe more
```

## Translations

Mapeo is designed to be used in any language, but we rely on volunteers like you to help with translations. You can see current translation status on the [Crowdin project page](https://crowdin.com/project/mapeo-mobile).

If you would like to add translations in your language, you can [sign up to Crowdin](https://crwd.in/mapeo-mobile) and being translating immediately.

If you would like your language added to the translations list, [please request it](https://github.com/digidem/mapeo-mobile/issues/new).

## Maintainers

- [@gmaclennan](https://github.com/gmaclennan)
- [@okdistribute](https://github.com/okdistribute)
- [@noffle](https://github.com/noffle)

## Community

Connect with the Mapeo community for support & to contribute!

- [**Mailing List**](https://lists.riseup.net/www/info/mapeo-en) (English)
- [**Mailing List**](https://lists.riseup.net/www/info/mapeo-es) (Spanish)
- [**IRC**](https://kiwiirc.com/nextclient/irc.freenode.net/) (channel #ddem)
- [**Slack**](http://slack.digital-democracy.org)

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Supporters

We are extremely grateful to companies that embrace open source and support
Mapeo Mobile with services-in-kind:

[![mapbox](logos/mapbox-logo-black.svg)](https://mapbox.com)
[![bugsnag](logos/bugsnag_logo_navy.svg)](https://bugsnag.com)

## License

GPLv3 © 2019 Digital Democracy
