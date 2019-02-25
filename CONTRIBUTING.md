## Troubleshooting

### `error: bundling failed: ReferenceError: Module not registered in graph`

If you see this error from the Metro Bundler it is most likely that you ran `npm install` and added modules when the Metro Bundler was already running (`npm start`). Try quitting with bundler with `Ctrl-C` and then re-starting it with
`npm start`. If that doesn't work also try restarting with a new cache with `npm start --reset-cache`.
