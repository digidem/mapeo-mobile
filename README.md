# mapeo-mobile

[![Build Status](https://app.bitrise.io/app/288e6b3c3069b8e6/status.svg?token=WQq3QO2MrSbNUnr4mfO8gQ&branch=master)](https://app.bitrise.io/app/288e6b3c3069b8e6)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Monitor and document the world around you

Mapeo Mobile is a mobile app (currently Android only) for offline mapping and monitoring.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

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

Offline maps must be placed in this folder:

```txt
/sdcard/Android/data/com.mapeo/files/styles/default
```

This folder should contain these files derectly under this `default` folder:

```txt
style.json
fonts/
tiles/
  my-offline-tiles.asar
  ...maybe more
```

## Maintainers

- [@gmaclennan](https://github.com/gmaclennan)
- [@karissa](https://github.com/karissa)
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
