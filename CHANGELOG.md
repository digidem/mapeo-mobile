# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0-beta.0](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.6...v1.1.0-beta.0) (2019-06-07)


### Bug Fixes

* **Manual GPS:** Adjust labels, placeholders & formatting ([5301720](https://github.com/digidem/mapeo-mobile/commit/5301720))
* **Manual GPS:** Fix back button crashing the app ([9a87a7e](https://github.com/digidem/mapeo-mobile/commit/9a87a7e))
* **Manual GPS:** Put zone number & letter above coordinates ([e78a86f](https://github.com/digidem/mapeo-mobile/commit/e78a86f))
* touchables for iOS ([3584f20](https://github.com/digidem/mapeo-mobile/commit/3584f20))


### Features

* **Design:** Add Expo storybook app for Android & iOS with no dev env ([74dd5f3](https://github.com/digidem/mapeo-mobile/commit/74dd5f3))
* Delete observation button ([#124](https://github.com/digidem/mapeo-mobile/issues/124)) ([095ab41](https://github.com/digidem/mapeo-mobile/commit/095ab41))



## [1.1.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.5...v1.1.0-alpha.6) (2019-06-05)


### Bug Fixes

* **Details:** Fix back button closing new observation. Now returns to previous screen. ([e12321a](https://github.com/digidem/mapeo-mobile/commit/e12321a))
* **Map:** Start map at last location if no GPS & don't zoom out when switching to follow location ([cbf10bb](https://github.com/digidem/mapeo-mobile/commit/cbf10bb))
* Improve mapeo core start-up after reload during development ([266a7de](https://github.com/digidem/mapeo-mobile/commit/266a7de))
* **UI:** Keep the splashscreen visible a bit longer whilst app loads ([eed5fe2](https://github.com/digidem/mapeo-mobile/commit/eed5fe2))


### Features

* **GPS:** Manual UTM coordinate entry ([#126](https://github.com/digidem/mapeo-mobile/issues/126)) ([cc96e0b](https://github.com/digidem/mapeo-mobile/commit/cc96e0b))
* **New Observations:** Add confirmation before closing new observation ([66b49d5](https://github.com/digidem/mapeo-mobile/commit/66b49d5))



## [1.1.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.4...v1.1.0-alpha.5) (2019-06-04)


### Bug Fixes

* Don't block interaction with the app whilst image resizes ([df9dfa1](https://github.com/digidem/mapeo-mobile/commit/df9dfa1))



## [1.1.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.3...v1.1.0-alpha.4) (2019-06-04)


### Features

* New home tab view: Home view remembers camera or map view when returning to it; should fix battery usage when in app is in background & speed up app ([8057481](https://github.com/digidem/mapeo-mobile/commit/8057481))



## [1.1.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.2...v1.1.0-alpha.3) (2019-06-03)


### Bug Fixes

* **photos:** Attempt to fix accasional failure of photos by increasing memory for app ([bce7328](https://github.com/digidem/mapeo-mobile/commit/bce7328))
* reduce background battery usage by ensuring GPS is turned off in background ([ec2de6e](https://github.com/digidem/mapeo-mobile/commit/ec2de6e))
* **photos:** fix photo error on old devices due to not reading rotation of phone ([80f5943](https://github.com/digidem/mapeo-mobile/commit/80f5943))
* **photos:** Fix photo errors due to out-of-memory on low-memory devices ([52f722d](https://github.com/digidem/mapeo-mobile/commit/52f722d))
* **thumbnails:** fix thumbnail view ([04b4dd0](https://github.com/digidem/mapeo-mobile/commit/04b4dd0))


### Features

* Don't reload app when switching away & returning ([0974a83](https://github.com/digidem/mapeo-mobile/commit/0974a83))
* **photos:** Add scaled photo view 🖼 🙌 ([ae09fd3](https://github.com/digidem/mapeo-mobile/commit/ae09fd3))
* Reduce battery usage by removing animated GPS icon ([cb7853b](https://github.com/digidem/mapeo-mobile/commit/cb7853b))



## [1.1.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.1...v1.1.0-alpha.2) (2019-05-31)


### Bug Fixes

* **Maps:** try to stop map crashes by switching to TextureView option ([1858da7](https://github.com/digidem/mapeo-mobile/commit/1858da7))


### Features

* 🚀 Share an observation + photos with WhatsApp, email or other Android app ([ad69993](https://github.com/digidem/mapeo-mobile/commit/ad69993))
* dates in Spanish ([d11bd54](https://github.com/digidem/mapeo-mobile/commit/d11bd54))



## [1.1.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.0...v1.1.0-alpha.1) (2019-05-30)


### Bug Fixes

* **DX:** fix storybook startup script to it opens the app after install ([fa39efc](https://github.com/digidem/mapeo-mobile/commit/fa39efc))
* **DX:** Fix storybook-native builds ([c37cbb0](https://github.com/digidem/mapeo-mobile/commit/c37cbb0))
* Fix app returning to last screen after a force restart ([51828e6](https://github.com/digidem/mapeo-mobile/commit/51828e6))
* Fix error when restarting app not at home screen ([c1abffc](https://github.com/digidem/mapeo-mobile/commit/c1abffc))


### Features

* Add additional details to an observation ([#125](https://github.com/digidem/mapeo-mobile/issues/125)) ([dc89f22](https://github.com/digidem/mapeo-mobile/commit/dc89f22))



# [1.1.0-alpha.0](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.3...v1.1.0-alpha.0) (2019-05-23)


### Bug Fixes

* **map:** "blue dot" user location should always show in the correct location now ([d167998](https://github.com/digidem/mapeo-mobile/commit/d167998))
* **sync:** stop listening to peer updates when sync modal is closed ([48d0a05](https://github.com/digidem/mapeo-mobile/commit/48d0a05))


### Features

* **photo:** rotate photo based on device rotation ([1ee8815](https://github.com/digidem/mapeo-mobile/commit/1ee8815))



# [1.0.0-beta.3](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2019-05-10)


### Bug Fixes

* **camera:** improve preview quality (don't create preview from thumbnail!) ([c7eb083](https://github.com/digidem/mapeo-mobile/commit/c7eb083))



# [1.0.0-beta.2](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2019-05-10)


### Bug Fixes

* **category view:** fix category icons not appearing on devices with high-density displays ([97b9943](https://github.com/digidem/mapeo-mobile/commit/97b9943))

* Remove 64bit builds to fix Galaxy S7 issue with Android v7 (#122) ([c163efc](https://github.com/digidem/mapeo-mobile/commit/c163efc))

### Features

* **sync:** set device name with random string at the end ([#121](https://github.com/digidem/mapeo-mobile/issues/121)) ([3c005a9](https://github.com/digidem/mapeo-mobile/commit/3c005a9))



# [1.0.0-beta.1](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2019-05-09)


### Bug Fixes

* **build:** Fix application ID for release variant ([4c7aaf9](https://github.com/digidem/mapeo-mobile/commit/4c7aaf9))



# [1.0.0-beta.0](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.10...v1.0.0-beta.0) (2019-05-09)


### Bug Fixes

* **camera:** Timeout with error if photo capture does not complete ([61f4926](https://github.com/digidem/mapeo-mobile/commit/61f4926))
* **UI:** Show "ahorita" instead of "have 4 segundos" until 1 minute. ([a61ebcf](https://github.com/digidem/mapeo-mobile/commit/a61ebcf))



# [1.0.0-alpha.10](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2019-05-09)


### Bug Fixes

* **view observation:** Fix details icon so it doesn't look like edit icon ([98e0856](https://github.com/digidem/mapeo-mobile/commit/98e0856))
* **view observation:** remove gray box where map should be ([218c812](https://github.com/digidem/mapeo-mobile/commit/218c812))
* **view observation:** When a field does not have a label defined in the preset, use the key property as the label ([fa0b13f](https://github.com/digidem/mapeo-mobile/commit/fa0b13f))
* **view observation:** when a field does not have an answer, show "sin respuesta" in gray ([5e98356](https://github.com/digidem/mapeo-mobile/commit/5e98356))


### Features

* **Edit Observation:** Add ability to edit existing observations ([5bd1987](https://github.com/digidem/mapeo-mobile/commit/5bd1987))



# [1.0.0-alpha.9](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2019-05-08)


### Bug Fixes

* Change default port to avoid clash with previous version of mapeo mobile ([ba98a48](https://github.com/digidem/mapeo-mobile/commit/ba98a48))
* **photos:** Fix photos not appearing on migrated observations ([17cedbd](https://github.com/digidem/mapeo-mobile/commit/17cedbd))
* **sync:** Adjust progress accuracy by counting photo as same progress as db item ([f08419b](https://github.com/digidem/mapeo-mobile/commit/f08419b))
* **sync:** Fix sync progress lock-up due to too many updates ([161e3c5](https://github.com/digidem/mapeo-mobile/commit/161e3c5))
* **sync:** Fix sync stopping when the phone sleeps or app is in background ([b02c805](https://github.com/digidem/mapeo-mobile/commit/b02c805))
* **sync:** Throttle sync updates to avoid sync screen grinding to a halt ([3adedfd](https://github.com/digidem/mapeo-mobile/commit/3adedfd))


### Features

* **sync:** Phone will not sleep while the sync screen is open ([c7fa73c](https://github.com/digidem/mapeo-mobile/commit/c7fa73c))
* **UX:** Show loading indication when observations are loading (e.g. during initial index) ([f2824c7](https://github.com/digidem/mapeo-mobile/commit/f2824c7))



# [1.0.0-alpha.8](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2019-05-07)


### Bug Fixes

* **category chooser:** Fix sorting of presets / categories to respect `sort` field in preset ([c0f707b](https://github.com/digidem/mapeo-mobile/commit/c0f707b))



# [1.0.0-alpha.7](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-05-04)


### Bug Fixes

* **build:** remove leftover detox pieces ([cf1315b](https://github.com/digidem/mapeo-mobile/commit/cf1315b))



# [1.0.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-04)


### Bug Fixes

* **build:** build for older (Android v5 and v6) devices using patched nodejs-mobile ([f2c2794](https://github.com/digidem/mapeo-mobile/commit/f2c2794))
* **build:** enable cleartext support, fix broken dev env ([dde646e](https://github.com/digidem/mapeo-mobile/commit/dde646e))
* **create observation:** fix keyboard disappearing when observation edit screen appears ([7d142e8](https://github.com/digidem/mapeo-mobile/commit/7d142e8))
* **edit observation:** avoid unnecessary re-renders ([3a8f228](https://github.com/digidem/mapeo-mobile/commit/3a8f228))
* **map:** Fix custom style not showing ([bf55b1b](https://github.com/digidem/mapeo-mobile/commit/bf55b1b))


### Features

* **18n:** Translate strings to Spanish ([e1afb32](https://github.com/digidem/mapeo-mobile/commit/e1afb32))
* **map:** Add location follow mode & zoom to location on first load ([8f7aeaf](https://github.com/digidem/mapeo-mobile/commit/8f7aeaf))
* **photos:** delete local temp photos after save to server ([4aaf9b8](https://github.com/digidem/mapeo-mobile/commit/4aaf9b8))
* **photos:** save preview sized photos in addition to thumbnails & originals ([ed643d9](https://github.com/digidem/mapeo-mobile/commit/ed643d9))



# [1.0.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2019-05-01)


### Bug Fixes

* **map:** Update react-native-mapbox to v7 pre-release ([39779dd](https://github.com/digidem/mapeo-mobile/commit/39779dd))
* **ObservationView:** crash when viewing an observation with empty fields defined in preset ([9b69a28](https://github.com/digidem/mapeo-mobile/commit/9b69a28))


### Features

* **map:** Offline style falls back to online style ([0fe38e5](https://github.com/digidem/mapeo-mobile/commit/0fe38e5))
* **map:** press on observation to open details ([ca2a6ad](https://github.com/digidem/mapeo-mobile/commit/ca2a6ad))



# [1.0.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2019-05-01)


### Bug Fixes

* **Camera:** Don't disable shutter after first photo ([155bcf0](https://github.com/digidem/mapeo-mobile/commit/155bcf0))
* **UI:** GPS spinner was too big ([afd27fa](https://github.com/digidem/mapeo-mobile/commit/afd27fa))
* Camera shutted disabled after taking photo ([1fb5a3f](https://github.com/digidem/mapeo-mobile/commit/1fb5a3f))
* crash on Android 6.0 on Moto G3 ([1b5f7ad](https://github.com/digidem/mapeo-mobile/commit/1b5f7ad))
* use SSID for wifi connectivity ([46009bf](https://github.com/digidem/mapeo-mobile/commit/46009bf))


### Features

* **build:** create QA build with debugging turned on ([a7e3dad](https://github.com/digidem/mapeo-mobile/commit/a7e3dad))
* **createObservation:** Confirmation before saving for weak or no GPS ([4af0524](https://github.com/digidem/mapeo-mobile/commit/4af0524))
* **UI:** Different header title for create vs edit observation ([74d986c](https://github.com/digidem/mapeo-mobile/commit/74d986c))
* Add relative dates ("2 minutes ago") ([50e9968](https://github.com/digidem/mapeo-mobile/commit/50e9968))
* Add Sync ([#119](https://github.com/digidem/mapeo-mobile/issues/119)) ([a886b2e](https://github.com/digidem/mapeo-mobile/commit/a886b2e))
* Add text entry to create observation (1st pass) ([ad4e848](https://github.com/digidem/mapeo-mobile/commit/ad4e848))
* Basic offline map style functionality ([8dbb308](https://github.com/digidem/mapeo-mobile/commit/8dbb308))
* format dates (english only for now) ([d998a60](https://github.com/digidem/mapeo-mobile/commit/d998a60))



# [1.0.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2019-04-26)


### Bug Fixes

* transform new observations on save ([42fb168](https://github.com/digidem/mapeo-mobile/commit/42fb168))


### Features

* **createObservation:** Add default presets for when the user has not included presets ([bbea3d8](https://github.com/digidem/mapeo-mobile/commit/bbea3d8))



# [1.0.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2019-04-26)


### Bug Fixes

* Custom entryFile for different release variants ([2386ab9](https://github.com/digidem/mapeo-mobile/commit/2386ab9))



# [1.0.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2019-04-25)


### Bug Fixes

* **internal:** don't unmount the whole camera screen on focus loss ([840ebab](https://github.com/digidem/mapeo-mobile/commit/840ebab))


### Features

* **newObservation:** Add save button (new observation is lost after app restart) ([92d615f](https://github.com/digidem/mapeo-mobile/commit/92d615f))
* **photos:** also create preview image ([7629cf4](https://github.com/digidem/mapeo-mobile/commit/7629cf4))
* Load and save observations and presets from mapeo-core ([0c5d686](https://github.com/digidem/mapeo-mobile/commit/0c5d686))
* load presets from mapeo core ([b4cbef1](https://github.com/digidem/mapeo-mobile/commit/b4cbef1))



# 1.0.0-alpha.0 (2019-04-17)


### Bug Fixes

* Turn off react-native-screens - fix touch events not firing ([5e44fe6](https://github.com/digidem/mapeo-mobile/commit/5e44fe6))


### Features

* add additional photos to a new observation ([d479b2d](https://github.com/digidem/mapeo-mobile/commit/d479b2d))
* Add app variants ([897a6ff](https://github.com/digidem/mapeo-mobile/commit/897a6ff))
* add category chooser screen ([bc32096](https://github.com/digidem/mapeo-mobile/commit/bc32096))
* add GPS Modal ([8c94493](https://github.com/digidem/mapeo-mobile/commit/8c94493))
* add GPS pill to header ([10dd199](https://github.com/digidem/mapeo-mobile/commit/10dd199))
* custom back icon button with bigger touch area ([76bb20c](https://github.com/digidem/mapeo-mobile/commit/76bb20c))
* Custom routing for New Observation flow ([2c5339a](https://github.com/digidem/mapeo-mobile/commit/2c5339a))
* custom transitions ([db47fe9](https://github.com/digidem/mapeo-mobile/commit/db47fe9))
* Edit navigation with close icon ([3545744](https://github.com/digidem/mapeo-mobile/commit/3545744))
* GPS pill + modal improvements ([38ff4e2](https://github.com/digidem/mapeo-mobile/commit/38ff4e2))
* hookup draft observation context ([3e5dfd8](https://github.com/digidem/mapeo-mobile/commit/3e5dfd8))
* If position is stale, show searching in UI ([0a9d2be](https://github.com/digidem/mapeo-mobile/commit/0a9d2be))
* persist navigation state ([dc2c82d](https://github.com/digidem/mapeo-mobile/commit/dc2c82d))
* remove transition animations ([d6b2b9e](https://github.com/digidem/mapeo-mobile/commit/d6b2b9e))
* rough & ready GPS modal screen ([2deacb3](https://github.com/digidem/mapeo-mobile/commit/2deacb3))
* save draft observation to async storage ([3c4328d](https://github.com/digidem/mapeo-mobile/commit/3c4328d))
