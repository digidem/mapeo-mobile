// @flow
import * as React from "react";
import nodejs from "nodejs-mobile-react-native";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";
import { AppState, PermissionsAndroid } from "react-native";
import RNFS from "react-native-fs";

import * as status from "../../backend/constants";
import ServerStatus from "./ServerStatus";

const log = debug("mapeo:AppLoading");

const DEFAULT_TIMEOUT = 10000; // 10 seconds

type Props = {
  children: React.Node,
  /** Time (ms) to wait for heartbeat from server before showing error */
  timeout: number
};

type State = {
  serverStatus: string,
  didTimeout: boolean,
  hasStoragePermission: boolean
};

type AppStateType = "active" | "background" | "inactive";

/**
 * Listens to the nodejs-mobile process and only renders children when the
 * server is up and running and listening.
 * On initial app load it waits for the server before dismissing the native
 * splash screen.
 * If it doesn't hear a heartbeat message for timeout, it displays a screen to
 * the user so they know something is wrong.
 */
export default class AppLoading extends React.Component<Props, State> {
  static defaultProps = {
    timeout: DEFAULT_TIMEOUT
  };

  state = {
    serverStatus: status.STARTING,
    didTimeout: false,
    hasStoragePermission: false
  };

  timeoutId: TimeoutID;
  _nodeAlive: boolean;
  _hasSentStoragePath: boolean;
  _hasStoragePermission: boolean;

  constructor(props: Props) {
    super(props);
    // Start up the node process
    nodejs.start("loader.js");
    this._nodeAlive = false;
    this.restartTimeout();
    log("Constructor");
  }

  async componentDidMount() {
    log("Didmount");
    nodejs.channel.addListener("status", this.handleStatusChange);
    AppState.addEventListener("change", this.handleAppStateChange);

    this._hasStoragePermission = await requestStoragePermission();
    this.sendStoragePathToNode();
  }

  componentWillUnmount() {
    nodejs.channel.removeListener("status", this.handleStatusChange);
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  // Once we have permission to access external storage and the nodejs process
  // has started, it needs to know about where to store shared data that the
  // user can access (normall /sdcard/)
  sendStoragePathToNode() {
    if (this._hasSentStoragePath) return;
    if (!(this._hasStoragePermission && this._nodeAlive)) return;
    nodejs.channel.post("storagePath", RNFS.ExternalDirectoryPath);
    this._hasSentStoragePath = true;
  }

  handleStatusChange = (serverStatus: string) => {
    // We know the process has started once we get the first message
    this._nodeAlive = true;
    this.sendStoragePathToNode();
    // If we get a heartbeat, restart the timeout timer
    if (serverStatus === status.LISTENING) this.restartTimeout();
    // No unnecessary re-renders
    if (serverStatus === this.state.serverStatus) return;
    // Re-rendering during CLOSING or CLOSED causes a crash if reloading the app
    // in development mode. No need to update the state for these statuses
    if (serverStatus === status.CLOSING || serverStatus === status.CLOSED)
      return;
    log("status change", serverStatus);
    this.setState({ serverStatus });
  };

  handleAppStateChange = (nextAppState: AppStateType) => {
    log("AppState change", nextAppState);
    // Clear timeout while app is in the background
    if (nextAppState === "active") {
      this.restartTimeout();
      this.setState({ serverStatus: status.STARTING });
    } else clearTimeout(this.timeoutId);
  };

  restartTimeout() {
    clearTimeout(this.timeoutId);
    if (this.state.didTimeout) this.setState({ didTimeout: false });
    this.timeoutId = setTimeout(() => {
      this.setState({ didTimeout: true });
    }, this.props.timeout);
  }

  render() {
    if (this.state.didTimeout) return <ServerStatus variant="timeout" />;
    switch (this.state.serverStatus) {
      case status.LISTENING:
        SplashScreen.hide();
        return this.props.children;
      case status.ERROR:
        return <ServerStatus variant="error" />;
      default:
        return <ServerStatus variant="waiting" />;
    }
  }
}

async function requestStoragePermission() {
  const status = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  ]);
  const readExternalPermission =
    status[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];
  const writeExternalPermission =
    status[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE];
  return (
    readExternalPermission === PermissionsAndroid.RESULTS.GRANTED &&
    writeExternalPermission === PermissionsAndroid.RESULTS.GRANTED
  );
}
