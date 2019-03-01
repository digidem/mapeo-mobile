## Troubleshooting

### `error: bundling failed: ReferenceError: Module not registered in graph`

If you see this error from the Metro Bundler it is most likely that you ran `npm install` and added modules when the Metro Bundler was already running (`npm start`). Try quitting with bundler with `Ctrl-C` and then re-starting it with
`npm start`. If that doesn't work also try restarting with a new cache with `npm start --reset-cache`.

### `ENOSPC` Error in gradle build

If you see Android builds failing with an error like this:

```
Error: watch /bitrise/src/node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/views/picker/events ENOSPC
    at FSWatcher.start (fs.js:1382:19)
    at Object.fs.watch (fs.js:1408:11)
    at NodeWatcher.watchdir (/bitrise/src/node_modules/sane/src/node_watcher.js:159:22)
    at Walker.<anonymous> (/bitrise/src/node_modules/sane/src/common.js:109:31)
    at emitTwo (events.js:126:13)
    at Walker.emit (events.js:214:7)
    at /bitrise/src/node_modules/walker/lib/walker.js:69:16
    at go$readdir$cb (/bitrise/src/node_modules/graceful-fs/graceful-fs.js:162:14)
    at FSReqWrap.oncomplete (fs.js:135:15)
```

Then try [increasing the number of inotify
watchers](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details)

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
