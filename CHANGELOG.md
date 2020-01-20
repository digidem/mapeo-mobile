# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0-alpha.0](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-beta.0...v2.1.0-alpha.0) (2020-01-20)

### Features

- Ask for confirmation when the user presses the back button when editing/creating an observation ([281553a](https://github.com/digidem/mapeo-mobile/commit/281553aab0df3674bbd46b1ab4b8564627924aab))
- Update to latest React Native & Unimodules (better performance and bug fixes) ([4d0123b](https://github.com/digidem/mapeo-mobile/commit/4d0123b8e97304757d552c4a67717c70978ac154))
- Use Android default animation for navigation (changes close icon on GPS and Sync screens) ([69d7b82](https://github.com/digidem/mapeo-mobile/commit/69d7b82dce7860c8e1d74ac0ceaea0d2a4f9762a))

### Bug Fixes

- Adjust projectKey styling and text ([c022422](https://github.com/digidem/mapeo-mobile/commit/c0224225c7ee03116d6ea7d5ae1a1dab5913838b))
- **Sync:** Touch up styles of no wifi sync screen ([8362831](https://github.com/digidem/mapeo-mobile/commit/8362831fddc5a7f58bd8633bdc1f3c9f78ef5e18))
- Don't render app until saved draft is loaded from storage ([f8d7a0b](https://github.com/digidem/mapeo-mobile/commit/f8d7a0b963e68bb987503c199d4db92609a23369))
- Fix bug when a user edits an existing observation and is returned to the home screen (map) ([9751501](https://github.com/digidem/mapeo-mobile/commit/975150194033d38a203ce39cba9000b7956281ee))
- Fix crash after deleting an observation's description ([330fdab](https://github.com/digidem/mapeo-mobile/commit/330fdab7f8ff701d13180113539cb06af7b86915))

## [2.0.0-beta.0](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.9...v2.0.0-beta.0) (2019-11-26)

## [2.0.0-alpha.9](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2019-11-25)

### Features

- Only allow deletion of your own observations ([21e90b8](https://github.com/digidem/mapeo-mobile/commit/21e90b80d666fa6f34b19f8ad6594e6ec8307c52))

### Bug Fixes

- **SyncModal:** Adjust "waiting for sync" to fill entire screen (for devices with large text settings) ([ea4d8df](https://github.com/digidem/mapeo-mobile/commit/ea4d8df8ec4b2e1106d45fb0dcc32197b14b2de4))
- After an uncaught error, always restart at the map screen (don't try to return to screen from before crash) ([2ea1d15](https://github.com/digidem/mapeo-mobile/commit/2ea1d15fea164bd3df0a3ea6faff28007205d696))
- Push share & delete buttons to bottom of screen ([6968258](https://github.com/digidem/mapeo-mobile/commit/696825816d51f9628088f3301228a791c7b986f4))
- Show uncaught error message translated (was only in English before) ([7cc4313](https://github.com/digidem/mapeo-mobile/commit/7cc4313b81382bd6f69b9bad18d84c6db33a5e78))

## [2.0.0-alpha.8](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2019-11-25)

### Features

- **TextField:** Show question hint under label instead of as placeholder ([a8c871e](https://github.com/digidem/mapeo-mobile/commit/a8c871e9b9848a9bcd1c70dca71c1506339f098e))

### Bug Fixes

- **ObservationDetails:** increase size and contrast of question hint text ([82ac384](https://github.com/digidem/mapeo-mobile/commit/82ac3847e5676bc426c341207359da831de92137))
- Fix right-margin of select-one and select-multiple options & adjust line height ([a23e0f2](https://github.com/digidem/mapeo-mobile/commit/a23e0f2a2cbb99e51351b447dde5216af80ba010))

## [2.0.0-alpha.7](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2019-11-23)

### Features

- Add photo thumbnails to observation list view ([fe74274](https://github.com/digidem/mapeo-mobile/commit/fe74274c943d620b3c66c408b1ca570c734dbf98))
- Don't allow edit of synced obs; show sync symbol on synced obs ([4a7a6c7](https://github.com/digidem/mapeo-mobile/commit/4a7a6c7efb96722288eb6415d582ac55c28f2e2b))
- Identify synced observations with a blue bar in list view ([d4b394b](https://github.com/digidem/mapeo-mobile/commit/d4b394bf08988dd604c0b37a8b3a51bf4f07900e))
- Show multiple photo thumbnails in observation list view ([b30b1b6](https://github.com/digidem/mapeo-mobile/commit/b30b1b6687f22314ccaaf315e2ed818ea055128f))

### Bug Fixes

- Don't collapse map in observation view when map does not load ([d077ece](https://github.com/digidem/mapeo-mobile/commit/d077ece680ba54f041e772e398584b0dfcc659cd))
- Fix navigation at end of questions pressing "Done" ([30e6112](https://github.com/digidem/mapeo-mobile/commit/30e61129290885f1d0b0935c1439368cc3819f12))

## [2.0.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2019-11-19)

### Bug Fixes

- Pin react-native-community/art version to fix progress animation crashing app ([5e5c4f0](https://github.com/digidem/mapeo-mobile/commit/5e5c4f02ece8dd84763b7e3a8640212981ba4516))

## [2.0.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2019-11-19)

## [2.0.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2019-11-19)

### Bug Fixes

- Fix manual GPS entry crashes and errors ([d11e3fe](https://github.com/digidem/mapeo-mobile/commit/d11e3fe6c4099891aa12499f5cff9d76d2847966))

## [2.0.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2019-11-19)

### Bug Fixes

- Don't log debug messages by default (console.log slows down react-native a lot) ([93045e8](https://github.com/digidem/mapeo-mobile/commit/93045e84653db2d9bed29c20aa7da41a609af5ac))
- Reduce frequency of sync updates to every 500ms to increase performance ([308221b](https://github.com/digidem/mapeo-mobile/commit/308221b52857ed3e0edc62ea02e592cf7d396091))

## [2.0.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2019-11-19)

### Bug Fixes

- Fix typo causing projectKey sync to fail ([105a76c](https://github.com/digidem/mapeo-mobile/commit/105a76c877c5dded0bd60508a91696112196e4ba))

## [2.0.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2019-11-19)

### Bug Fixes

- Add ES translations for sync errors ([b445078](https://github.com/digidem/mapeo-mobile/commit/b44507827b0b04e5969fe6179050e9c88f51f4fd))

## [2.0.0-alpha.0](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.11...v2.0.0-alpha.0) (2019-11-19)

### ⚠ BREAKING CHANGES

- New sync protocol incompatible with Mapeo v1

### Features

- Add error messages for incompatible mapeo versions ([f41f7ba](https://github.com/digidem/mapeo-mobile/commit/f41f7bad303c263ca21ab7e8818f9c130579e70b))
- Encrypt sync with projectKey ([6916360](https://github.com/digidem/mapeo-mobile/commit/69163607c826d2e11177eb2b2d5b8e8455c2e4e3))
- Only sync with peers with matching projectKey ([39db7a6](https://github.com/digidem/mapeo-mobile/commit/39db7a6fb0c198819ab350e300729477c40ef0ff))

### Bug Fixes

- Enable sync screen to scroll when there are many sync peers ([4ee34f6](https://github.com/digidem/mapeo-mobile/commit/4ee34f6ceda1102b761a0dce5f98f4f02826b099))

### chore

- New sync protocol incompatible with Mapeo v1 ([dddcecc](https://github.com/digidem/mapeo-mobile/commit/dddcecc16a4acd8ff766d5bdb25bcacd4b14f0be))

## [1.2.0-alpha.11](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.10...v1.2.0-alpha.11) (2019-11-15)

### Bug Fixes

- Fix observations and blue location dot not appearing on map ([b1d52ea](https://github.com/digidem/mapeo-mobile/commit/b1d52eae38d12d31117aa45149c7cbd7225365b6))
- Show "Add+" button even if map does not load ([9c5d737](https://github.com/digidem/mapeo-mobile/commit/9c5d7372d17b7efef748d97a0874bf3ba8704af7))

## [1.2.0-alpha.10](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.9...v1.2.0-alpha.10) (2019-11-14)

### Bug Fixes

- Fix map error when no offline map style is present ([a87403b](https://github.com/digidem/mapeo-mobile/commit/a87403b586564ae023013be37d511df2871399c9))

## [1.2.0-alpha.9](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.8...v1.2.0-alpha.9) (2019-11-12)

### Features

- Allow select_one options to be deselected ([#263](https://github.com/digidem/mapeo-mobile/issues/263)) ([d8757a8](https://github.com/digidem/mapeo-mobile/commit/d8757a8c03304180af2ff960f51012ddb5ee796b))
- Corrections to strings & translations ([e0213ec](https://github.com/digidem/mapeo-mobile/commit/e0213ec5489fe8ce8d93b5f5669c7c3c3c854a0b))
- Support select-multiple details questions ([#262](https://github.com/digidem/mapeo-mobile/issues/262)) ([87c98fb](https://github.com/digidem/mapeo-mobile/commit/87c98fbb0af5138d05f3c595eb26e405502c9be3))

## [1.2.0-alpha.8](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.7...v1.2.0-alpha.8) (2019-11-05)

### Bug Fixes

- Allow publishing on Google Play Store by enabling 64-bit builds ([4cc4107](https://github.com/digidem/mapeo-mobile/commit/4cc41071622fc4cba9562a36bf4e79d9e698c6da))
- Fix map not loading (black screen) when device is offline ([20038b7](https://github.com/digidem/mapeo-mobile/commit/20038b7ac474f5cc47a9ac9aa8e4bb1f07ea378b))

## [1.2.0-alpha.7](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.6...v1.2.0-alpha.7) (2019-10-28)

### Features

- Add translation / internationalization ([#255](https://github.com/digidem/mapeo-mobile/issues/255)) ([0cdb954](https://github.com/digidem/mapeo-mobile/commit/0cdb954d16c185f8d4fd71fa911dada8e1709c59))
- use react-native-v8 instead of JSC ([bec5949](https://github.com/digidem/mapeo-mobile/commit/bec5949bc3691bf2d076503f05ef4a0acad710ec))

### Bug Fixes

- Fix relative times to avoid long timeout warnings ([b48ec3e](https://github.com/digidem/mapeo-mobile/commit/b48ec3eeeb9bfeb3c2d34680a8ea831249c0279c))

## [1.2.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.5...v1.2.0-alpha.6) (2019-10-11)

### Bug Fixes

- Do not try to add map layers until style has loaded ([a398494](https://github.com/digidem/mapeo-mobile/commit/a398494))
- Show loading while checking for online/offline style. Prefer offline style over online style. ([b3c9727](https://github.com/digidem/mapeo-mobile/commit/b3c9727))
- Turn off telemetry on first load ([909e670](https://github.com/digidem/mapeo-mobile/commit/909e670))

## [1.2.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.4...v1.2.0-alpha.5) (2019-10-03)

### Bug Fixes

- Don't crash when selecting an observation on the map ([68326a6](https://github.com/digidem/mapeo-mobile/commit/68326a6))
- Don't disable mapbox telemetry ([05ab7d2](https://github.com/digidem/mapeo-mobile/commit/05ab7d2))
- Fix Manual GPS dialog translations ([f2de933](https://github.com/digidem/mapeo-mobile/commit/f2de933))
- Fix Manual GPS screen text ([7464812](https://github.com/digidem/mapeo-mobile/commit/7464812))
- Fix map unexpectedly moving/zooming ([eebfa5a](https://github.com/digidem/mapeo-mobile/commit/eebfa5a))

## [1.2.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.3...v1.2.0-alpha.4) (2019-09-21)

### Bug Fixes

- Downgrade to kappa-core v3, fix failing sync ([5c26a48](https://github.com/digidem/mapeo-mobile/commit/5c26a48))
- Show correct icon for desktops in sync ([6758ccb](https://github.com/digidem/mapeo-mobile/commit/6758ccb))

## [1.2.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.2...v1.2.0-alpha.3) (2019-09-17)

### Bug Fixes

- Fix all kinds of bugs with editing observations and adding photos ([807d75e](https://github.com/digidem/mapeo-mobile/commit/807d75e))
- reset navigation state ([0b9f77a](https://github.com/digidem/mapeo-mobile/commit/0b9f77a))

## [1.2.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.1...v1.2.0-alpha.2) (2019-09-16)

### Bug Fixes

- **photos:** Scroll photo thumbnails to latest photo after taking a new photo ([10f2d82](https://github.com/digidem/mapeo-mobile/commit/10f2d82))
- Don't show keyboard at first when creating a new observation ([988a4b5](https://github.com/digidem/mapeo-mobile/commit/988a4b5))

### Features

- Remove request for storage permissions ([#196](https://github.com/digidem/mapeo-mobile/issues/196)) ([0c3c787](https://github.com/digidem/mapeo-mobile/commit/0c3c787))
- Swipe between multiple photos for an observation 🎉 ([#199](https://github.com/digidem/mapeo-mobile/issues/199)) ([9429c2d](https://github.com/digidem/mapeo-mobile/commit/9429c2d))
- Add server route for accessing the device id (this is from updates to @mapeo/core and mapeo-server, there are no changes in this repo for this)

## [1.2.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v1.2.0-alpha.0...v1.2.0-alpha.1) (2019-08-07)

### Bug Fixes

- Fix crashes from accelerometer subscription ([#189](https://github.com/digidem/mapeo-mobile/issues/189)) ([957db4d](https://github.com/digidem/mapeo-mobile/commit/957db4d))
- override map style & preset cache so that changes appear after restarting the
  app ([#188](https://github.com/digidem/mapeo-mobile/issues/188))
  ([c425d5d](https://github.com/digidem/mapeo-mobile/commit/c425d5d))
- **map:** Don't animate inset observation map when it first renders
  ([78d3471](https://github.com/digidem/mapeo-mobile/commit/78d3471))
- **map:** Fix icon placement for inset map on observation view ([f9364bb](https://github.com/digidem/mapeo-mobile/commit/f9364bb))
- **UI:** Don't leave a gap when observation description is empty ([578fa43](https://github.com/digidem/mapeo-mobile/commit/578fa43))

## [1.2.0-alpha.0](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.8...v1.2.0-alpha.0) (2019-08-05)

### Bug Fixes

- Remove react-native-screens (was breaking build) ([234cbe5](https://github.com/digidem/mapeo-mobile/commit/234cbe5))

### Features

- Upgrade to React Native v0.60.4 ([#183](https://github.com/digidem/mapeo-mobile/issues/183)) ([e2bf58b](https://github.com/digidem/mapeo-mobile/commit/e2bf58b))

## [1.1.0-beta.8](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.7...v1.1.0-beta.8) (2019-07-04)

### Features

- Add map and improve UX of observation view ([#131](https://github.com/digidem/mapeo-mobile/issues/131)) ([6299cde](https://github.com/digidem/mapeo-mobile/commit/6299cde))
- update UX for new/edit observation ([#154](https://github.com/digidem/mapeo-mobile/issues/154)) ([c1392e9](https://github.com/digidem/mapeo-mobile/commit/c1392e9))

## [1.1.0-beta.7](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.6...v1.1.0-beta.7) (2019-06-25)

### Bug Fixes

- Attempt to fix camera errors by delaying navigation away from camera until photo is taken ([7bfc990](https://github.com/digidem/mapeo-mobile/commit/7bfc990))

## [1.1.0-beta.6](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.5...v1.1.0-beta.6) (2019-06-21)

### Bug Fixes

- Fix bug in bug reporting... ([a9a456b](https://github.com/digidem/mapeo-mobile/commit/a9a456b))

## [1.1.0-beta.5](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.4...v1.1.0-beta.5) (2019-06-21)

### Bug Fixes

- pin kappa-osm to v3.0.3 pending update to kappa-core@3 ([acb1284](https://github.com/digidem/mapeo-mobile/commit/acb1284))
- typo causing server start crash ([ae22022](https://github.com/digidem/mapeo-mobile/commit/ae22022))

## [1.1.0-beta.4](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.3...v1.1.0-beta.4) (2019-06-21)

### Bug Fixes

- Fix map zoom-out when switching back to map screen when not in follow-mode ([#147](https://github.com/digidem/mapeo-mobile/issues/147)) ([372c6fc](https://github.com/digidem/mapeo-mobile/commit/372c6fc))
- Fix various crashes and add bugsnag reporting ([#148](https://github.com/digidem/mapeo-mobile/issues/148)) ([d8579a9](https://github.com/digidem/mapeo-mobile/commit/d8579a9)), closes [#134](https://github.com/digidem/mapeo-mobile/issues/134)
- update unimodules, should fix some crashes seen in the wild ([b211ed2](https://github.com/digidem/mapeo-mobile/commit/b211ed2))
- **build:** pin version of reanimated pending fix of https://github.com/kmagiera/react-native-reanimated/issues/315 ([31b0fc4](https://github.com/digidem/mapeo-mobile/commit/31b0fc4))

## [1.1.0-beta.3](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2019-06-14)

### Bug Fixes

- **Manual GPS:** Determine whether the user is using UTM zone letters for latitude bands or hemisphere ([9bac3e1](https://github.com/digidem/mapeo-mobile/commit/9bac3e1))
- **Manual GPS:** Fix app crash when coords can't be formatted as UTM ([dd3c6bd](https://github.com/digidem/mapeo-mobile/commit/dd3c6bd))

### Features

- Add Bugsnag error reporting ([#136](https://github.com/digidem/mapeo-mobile/issues/136)) ([56b1135](https://github.com/digidem/mapeo-mobile/commit/56b1135))

## [1.1.0-beta.2](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2019-06-10)

### Bug Fixes

- Fix occasional crash during startup ([b43f87a](https://github.com/digidem/mapeo-mobile/commit/b43f87a))

## [1.1.0-beta.1](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-beta.0...v1.1.0-beta.1) (2019-06-07)

### Bug Fixes

- Integrate new mapeo core that de-forks observations ([97f46b8](https://github.com/digidem/mapeo-mobile/commit/97f46b8))

## [1.1.0-beta.0](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.6...v1.1.0-beta.0) (2019-06-07)

### Bug Fixes

- **Manual GPS:** Adjust labels, placeholders & formatting ([5301720](https://github.com/digidem/mapeo-mobile/commit/5301720))
- **Manual GPS:** Fix back button crashing the app ([9a87a7e](https://github.com/digidem/mapeo-mobile/commit/9a87a7e))
- **Manual GPS:** Put zone number & letter above coordinates ([e78a86f](https://github.com/digidem/mapeo-mobile/commit/e78a86f))
- touchables for iOS ([3584f20](https://github.com/digidem/mapeo-mobile/commit/3584f20))

### Features

- **Design:** Add Expo storybook app for Android & iOS with no dev env ([74dd5f3](https://github.com/digidem/mapeo-mobile/commit/74dd5f3))
- Delete observation button ([#124](https://github.com/digidem/mapeo-mobile/issues/124)) ([095ab41](https://github.com/digidem/mapeo-mobile/commit/095ab41))

## [1.1.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.5...v1.1.0-alpha.6) (2019-06-05)

### Bug Fixes

- **Details:** Fix back button closing new observation. Now returns to previous screen. ([e12321a](https://github.com/digidem/mapeo-mobile/commit/e12321a))
- **Map:** Start map at last location if no GPS & don't zoom out when switching to follow location ([cbf10bb](https://github.com/digidem/mapeo-mobile/commit/cbf10bb))
- Improve mapeo core start-up after reload during development ([266a7de](https://github.com/digidem/mapeo-mobile/commit/266a7de))
- **UI:** Keep the splashscreen visible a bit longer whilst app loads ([eed5fe2](https://github.com/digidem/mapeo-mobile/commit/eed5fe2))

### Features

- **GPS:** Manual UTM coordinate entry ([#126](https://github.com/digidem/mapeo-mobile/issues/126)) ([cc96e0b](https://github.com/digidem/mapeo-mobile/commit/cc96e0b))
- **New Observations:** Add confirmation before closing new observation ([66b49d5](https://github.com/digidem/mapeo-mobile/commit/66b49d5))

## [1.1.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.4...v1.1.0-alpha.5) (2019-06-04)

### Bug Fixes

- Don't block interaction with the app whilst image resizes ([df9dfa1](https://github.com/digidem/mapeo-mobile/commit/df9dfa1))

## [1.1.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.3...v1.1.0-alpha.4) (2019-06-04)

### Features

- New home tab view: Home view remembers camera or map view when returning to it; should fix battery usage when in app is in background & speed up app ([8057481](https://github.com/digidem/mapeo-mobile/commit/8057481))

## [1.1.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.2...v1.1.0-alpha.3) (2019-06-03)

### Bug Fixes

- **photos:** Attempt to fix accasional failure of photos by increasing memory for app ([bce7328](https://github.com/digidem/mapeo-mobile/commit/bce7328))
- reduce background battery usage by ensuring GPS is turned off in background ([ec2de6e](https://github.com/digidem/mapeo-mobile/commit/ec2de6e))
- **photos:** fix photo error on old devices due to not reading rotation of phone ([80f5943](https://github.com/digidem/mapeo-mobile/commit/80f5943))
- **photos:** Fix photo errors due to out-of-memory on low-memory devices ([52f722d](https://github.com/digidem/mapeo-mobile/commit/52f722d))
- **thumbnails:** fix thumbnail view ([04b4dd0](https://github.com/digidem/mapeo-mobile/commit/04b4dd0))

### Features

- Don't reload app when switching away & returning ([0974a83](https://github.com/digidem/mapeo-mobile/commit/0974a83))
- **photos:** Add scaled photo view 🖼 🙌 ([ae09fd3](https://github.com/digidem/mapeo-mobile/commit/ae09fd3))
- Reduce battery usage by removing animated GPS icon ([cb7853b](https://github.com/digidem/mapeo-mobile/commit/cb7853b))

## [1.1.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.1...v1.1.0-alpha.2) (2019-05-31)

### Bug Fixes

- **Maps:** try to stop map crashes by switching to TextureView option ([1858da7](https://github.com/digidem/mapeo-mobile/commit/1858da7))

### Features

- 🚀 Share an observation + photos with WhatsApp, email or other Android app ([ad69993](https://github.com/digidem/mapeo-mobile/commit/ad69993))
- dates in Spanish ([d11bd54](https://github.com/digidem/mapeo-mobile/commit/d11bd54))

## [1.1.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v1.1.0-alpha.0...v1.1.0-alpha.1) (2019-05-30)

### Bug Fixes

- **DX:** fix storybook startup script to it opens the app after install ([fa39efc](https://github.com/digidem/mapeo-mobile/commit/fa39efc))
- **DX:** Fix storybook-native builds ([c37cbb0](https://github.com/digidem/mapeo-mobile/commit/c37cbb0))
- Fix app returning to last screen after a force restart ([51828e6](https://github.com/digidem/mapeo-mobile/commit/51828e6))
- Fix error when restarting app not at home screen ([c1abffc](https://github.com/digidem/mapeo-mobile/commit/c1abffc))

### Features

- Add additional details to an observation ([#125](https://github.com/digidem/mapeo-mobile/issues/125)) ([dc89f22](https://github.com/digidem/mapeo-mobile/commit/dc89f22))

# [1.1.0-alpha.0](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.3...v1.1.0-alpha.0) (2019-05-23)

### Bug Fixes

- **map:** "blue dot" user location should always show in the correct location now ([d167998](https://github.com/digidem/mapeo-mobile/commit/d167998))
- **sync:** stop listening to peer updates when sync modal is closed ([48d0a05](https://github.com/digidem/mapeo-mobile/commit/48d0a05))

### Features

- **photo:** rotate photo based on device rotation ([1ee8815](https://github.com/digidem/mapeo-mobile/commit/1ee8815))

# [1.0.0-beta.3](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2019-05-10)

### Bug Fixes

- **camera:** improve preview quality (don't create preview from thumbnail!) ([c7eb083](https://github.com/digidem/mapeo-mobile/commit/c7eb083))

# [1.0.0-beta.2](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2019-05-10)

### Bug Fixes

- **category view:** fix category icons not appearing on devices with high-density displays ([97b9943](https://github.com/digidem/mapeo-mobile/commit/97b9943))

- Remove 64bit builds to fix Galaxy S7 issue with Android v7 (#122) ([c163efc](https://github.com/digidem/mapeo-mobile/commit/c163efc))

### Features

- **sync:** set device name with random string at the end ([#121](https://github.com/digidem/mapeo-mobile/issues/121)) ([3c005a9](https://github.com/digidem/mapeo-mobile/commit/3c005a9))

# [1.0.0-beta.1](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2019-05-09)

### Bug Fixes

- **build:** Fix application ID for release variant ([4c7aaf9](https://github.com/digidem/mapeo-mobile/commit/4c7aaf9))

# [1.0.0-beta.0](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.10...v1.0.0-beta.0) (2019-05-09)

### Bug Fixes

- **camera:** Timeout with error if photo capture does not complete ([61f4926](https://github.com/digidem/mapeo-mobile/commit/61f4926))
- **UI:** Show "ahorita" instead of "have 4 segundos" until 1 minute. ([a61ebcf](https://github.com/digidem/mapeo-mobile/commit/a61ebcf))

# [1.0.0-alpha.10](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2019-05-09)

### Bug Fixes

- **view observation:** Fix details icon so it doesn't look like edit icon ([98e0856](https://github.com/digidem/mapeo-mobile/commit/98e0856))
- **view observation:** remove gray box where map should be ([218c812](https://github.com/digidem/mapeo-mobile/commit/218c812))
- **view observation:** When a field does not have a label defined in the preset, use the key property as the label ([fa0b13f](https://github.com/digidem/mapeo-mobile/commit/fa0b13f))
- **view observation:** when a field does not have an answer, show "sin respuesta" in gray ([5e98356](https://github.com/digidem/mapeo-mobile/commit/5e98356))

### Features

- **Edit Observation:** Add ability to edit existing observations ([5bd1987](https://github.com/digidem/mapeo-mobile/commit/5bd1987))

# [1.0.0-alpha.9](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2019-05-08)

### Bug Fixes

- Change default port to avoid clash with previous version of mapeo mobile ([ba98a48](https://github.com/digidem/mapeo-mobile/commit/ba98a48))
- **photos:** Fix photos not appearing on migrated observations ([17cedbd](https://github.com/digidem/mapeo-mobile/commit/17cedbd))
- **sync:** Adjust progress accuracy by counting photo as same progress as db item ([f08419b](https://github.com/digidem/mapeo-mobile/commit/f08419b))
- **sync:** Fix sync progress lock-up due to too many updates ([161e3c5](https://github.com/digidem/mapeo-mobile/commit/161e3c5))
- **sync:** Fix sync stopping when the phone sleeps or app is in background ([b02c805](https://github.com/digidem/mapeo-mobile/commit/b02c805))
- **sync:** Throttle sync updates to avoid sync screen grinding to a halt ([3adedfd](https://github.com/digidem/mapeo-mobile/commit/3adedfd))

### Features

- **sync:** Phone will not sleep while the sync screen is open ([c7fa73c](https://github.com/digidem/mapeo-mobile/commit/c7fa73c))
- **UX:** Show loading indication when observations are loading (e.g. during initial index) ([f2824c7](https://github.com/digidem/mapeo-mobile/commit/f2824c7))

# [1.0.0-alpha.8](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2019-05-07)

### Bug Fixes

- **category chooser:** Fix sorting of presets / categories to respect `sort` field in preset ([c0f707b](https://github.com/digidem/mapeo-mobile/commit/c0f707b))

# [1.0.0-alpha.7](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-05-04)

### Bug Fixes

- **build:** remove leftover detox pieces ([cf1315b](https://github.com/digidem/mapeo-mobile/commit/cf1315b))

# [1.0.0-alpha.6](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2019-05-04)

### Bug Fixes

- **build:** build for older (Android v5 and v6) devices using patched nodejs-mobile ([f2c2794](https://github.com/digidem/mapeo-mobile/commit/f2c2794))
- **build:** enable cleartext support, fix broken dev env ([dde646e](https://github.com/digidem/mapeo-mobile/commit/dde646e))
- **create observation:** fix keyboard disappearing when observation edit screen appears ([7d142e8](https://github.com/digidem/mapeo-mobile/commit/7d142e8))
- **edit observation:** avoid unnecessary re-renders ([3a8f228](https://github.com/digidem/mapeo-mobile/commit/3a8f228))
- **map:** Fix custom style not showing ([bf55b1b](https://github.com/digidem/mapeo-mobile/commit/bf55b1b))

### Features

- **18n:** Translate strings to Spanish ([e1afb32](https://github.com/digidem/mapeo-mobile/commit/e1afb32))
- **map:** Add location follow mode & zoom to location on first load ([8f7aeaf](https://github.com/digidem/mapeo-mobile/commit/8f7aeaf))
- **photos:** delete local temp photos after save to server ([4aaf9b8](https://github.com/digidem/mapeo-mobile/commit/4aaf9b8))
- **photos:** save preview sized photos in addition to thumbnails & originals ([ed643d9](https://github.com/digidem/mapeo-mobile/commit/ed643d9))

# [1.0.0-alpha.5](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2019-05-01)

### Bug Fixes

- **map:** Update react-native-mapbox to v7 pre-release ([39779dd](https://github.com/digidem/mapeo-mobile/commit/39779dd))
- **ObservationView:** crash when viewing an observation with empty fields defined in preset ([9b69a28](https://github.com/digidem/mapeo-mobile/commit/9b69a28))

### Features

- **map:** Offline style falls back to online style ([0fe38e5](https://github.com/digidem/mapeo-mobile/commit/0fe38e5))
- **map:** press on observation to open details ([ca2a6ad](https://github.com/digidem/mapeo-mobile/commit/ca2a6ad))

# [1.0.0-alpha.4](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2019-05-01)

### Bug Fixes

- **Camera:** Don't disable shutter after first photo ([155bcf0](https://github.com/digidem/mapeo-mobile/commit/155bcf0))
- **UI:** GPS spinner was too big ([afd27fa](https://github.com/digidem/mapeo-mobile/commit/afd27fa))
- Camera shutted disabled after taking photo ([1fb5a3f](https://github.com/digidem/mapeo-mobile/commit/1fb5a3f))
- crash on Android 6.0 on Moto G3 ([1b5f7ad](https://github.com/digidem/mapeo-mobile/commit/1b5f7ad))
- use SSID for wifi connectivity ([46009bf](https://github.com/digidem/mapeo-mobile/commit/46009bf))

### Features

- **build:** create QA build with debugging turned on ([a7e3dad](https://github.com/digidem/mapeo-mobile/commit/a7e3dad))
- **createObservation:** Confirmation before saving for weak or no GPS ([4af0524](https://github.com/digidem/mapeo-mobile/commit/4af0524))
- **UI:** Different header title for create vs edit observation ([74d986c](https://github.com/digidem/mapeo-mobile/commit/74d986c))
- Add relative dates ("2 minutes ago") ([50e9968](https://github.com/digidem/mapeo-mobile/commit/50e9968))
- Add Sync ([#119](https://github.com/digidem/mapeo-mobile/issues/119)) ([a886b2e](https://github.com/digidem/mapeo-mobile/commit/a886b2e))
- Add text entry to create observation (1st pass) ([ad4e848](https://github.com/digidem/mapeo-mobile/commit/ad4e848))
- Basic offline map style functionality ([8dbb308](https://github.com/digidem/mapeo-mobile/commit/8dbb308))
- format dates (english only for now) ([d998a60](https://github.com/digidem/mapeo-mobile/commit/d998a60))

# [1.0.0-alpha.3](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2019-04-26)

### Bug Fixes

- transform new observations on save ([42fb168](https://github.com/digidem/mapeo-mobile/commit/42fb168))

### Features

- **createObservation:** Add default presets for when the user has not included presets ([bbea3d8](https://github.com/digidem/mapeo-mobile/commit/bbea3d8))

# [1.0.0-alpha.2](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2019-04-26)

### Bug Fixes

- Custom entryFile for different release variants ([2386ab9](https://github.com/digidem/mapeo-mobile/commit/2386ab9))

# [1.0.0-alpha.1](https://github.com/digidem/mapeo-mobile/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2019-04-25)

### Bug Fixes

- **internal:** don't unmount the whole camera screen on focus loss ([840ebab](https://github.com/digidem/mapeo-mobile/commit/840ebab))

### Features

- **newObservation:** Add save button (new observation is lost after app restart) ([92d615f](https://github.com/digidem/mapeo-mobile/commit/92d615f))
- **photos:** also create preview image ([7629cf4](https://github.com/digidem/mapeo-mobile/commit/7629cf4))
- Load and save observations and presets from mapeo-core ([0c5d686](https://github.com/digidem/mapeo-mobile/commit/0c5d686))
- load presets from mapeo core ([b4cbef1](https://github.com/digidem/mapeo-mobile/commit/b4cbef1))

# 1.0.0-alpha.0 (2019-04-17)

### Bug Fixes

- Turn off react-native-screens - fix touch events not firing ([5e44fe6](https://github.com/digidem/mapeo-mobile/commit/5e44fe6))

### Features

- add additional photos to a new observation ([d479b2d](https://github.com/digidem/mapeo-mobile/commit/d479b2d))
- Add app variants ([897a6ff](https://github.com/digidem/mapeo-mobile/commit/897a6ff))
- add category chooser screen ([bc32096](https://github.com/digidem/mapeo-mobile/commit/bc32096))
- add GPS Modal ([8c94493](https://github.com/digidem/mapeo-mobile/commit/8c94493))
- add GPS pill to header ([10dd199](https://github.com/digidem/mapeo-mobile/commit/10dd199))
- custom back icon button with bigger touch area ([76bb20c](https://github.com/digidem/mapeo-mobile/commit/76bb20c))
- Custom routing for New Observation flow ([2c5339a](https://github.com/digidem/mapeo-mobile/commit/2c5339a))
- custom transitions ([db47fe9](https://github.com/digidem/mapeo-mobile/commit/db47fe9))
- Edit navigation with close icon ([3545744](https://github.com/digidem/mapeo-mobile/commit/3545744))
- GPS pill + modal improvements ([38ff4e2](https://github.com/digidem/mapeo-mobile/commit/38ff4e2))
- hookup draft observation context ([3e5dfd8](https://github.com/digidem/mapeo-mobile/commit/3e5dfd8))
- If position is stale, show searching in UI ([0a9d2be](https://github.com/digidem/mapeo-mobile/commit/0a9d2be))
- persist navigation state ([dc2c82d](https://github.com/digidem/mapeo-mobile/commit/dc2c82d))
- remove transition animations ([d6b2b9e](https://github.com/digidem/mapeo-mobile/commit/d6b2b9e))
- rough & ready GPS modal screen ([2deacb3](https://github.com/digidem/mapeo-mobile/commit/2deacb3))
- save draft observation to async storage ([3c4328d](https://github.com/digidem/mapeo-mobile/commit/3c4328d))
