# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
