// @flow
import * as React from "react";
import nodejs from "nodejs-mobile-react-native";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";
import { AppState } from "react-native";
import RNFS from "react-native-fs";

import * as status from "../../backend/constants";
import ServerStatus from "./ServerStatus";
import {
  withPermissions,
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";

const log = debug("mapeo:AppLoading");

const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Hide the spashscreen once children have mounted. If we hide before mounting
 * then the user sees the <ServerStatus variant="waiting" /> screen.
 */
class HideSplashScreen extends React.Component<{ children: React.Node }> {
  componentDidMount() {
    // We need to leave a slight delay for the map to do an initial render
    setTimeout(() => {
      SplashScreen.hide();
      log("hiding splashscreen");
    }, 500);
  }
  render() {
    return this.props.children;
  }
}

type Props = {
  children: React.Node,
  /** Time (ms) to wait for heartbeat from server before showing error */
  timeout: number
};

type State = {
  serverStatus: string,
  didTimeout: boolean
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
class AppLoading extends React.Component<Props, State> {
  static defaultProps = {
    timeout: DEFAULT_TIMEOUT
  };

  state = {
    serverStatus: status.STARTING,
    didTimeout: false
  };

  timeoutId: TimeoutID;
  _nodeAlive: boolean;
  _hasSentStoragePath: boolean;
  _hasStoragePermission: boolean;

  constructor(props: Props) {
    super(props);
    log("REQUESTING NODE START");
    // Start up the node process
    nodejs.start("loader.js");
    this._nodeAlive = false;
    this.restartTimeout();
  }

  async componentDidMount() {
    log("Didmount");
    nodejs.channel.addListener("status", this.handleStatusChange);
    AppState.addEventListener("change", this.handleAppStateChange);
    // $FlowFixMe - needs HOC type to be fixed
    this.props.requestPermissions([
      PERMISSIONS.CAMERA,
      PERMISSIONS.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ACCESS_FINE_LOCATION,
      PERMISSIONS.READ_EXTERNAL_STORAGE,
      PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
  }

  componentDidUpdate() {
    this.sendStoragePathToNode();
  }

  componentWillUnmount() {
    nodejs.channel.removeListener("status", this.handleStatusChange);
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  hasStoragePermission() {
    // $FlowFixMe - needs HOC type to be fixed
    const { permissions } = this.props;
    return (
      permissions[PERMISSIONS.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
      permissions[PERMISSIONS.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
    );
  }

  // Once we have permission to access external storage and the nodejs process
  // has started, it needs to know about where to store shared data that the
  // user can access (normall /sdcard/)
  sendStoragePathToNode() {
    if (this._hasSentStoragePath) return;
    if (!(this.hasStoragePermission() && this._nodeAlive)) return;
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
    log("status change", serverStatus);
    // Re-rendering during CLOSING or CLOSED causes a crash if reloading the app
    // in development mode. No need to update the state for these statuses
    if (serverStatus === status.CLOSING || serverStatus === status.CLOSED)
      return;
    this.setState({ serverStatus });
  };

  handleAppStateChange = (nextAppState: AppStateType) => {
    log("AppState change", nextAppState);
    // Clear timeout while app is in the background
    if (nextAppState === "active") {
      this.restartTimeout();
      this.setState({ serverStatus: status.STARTING });
    } else {
      clearTimeout(this.timeoutId);
      // Show splashscreen while app is in background
      SplashScreen.show();
    }
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
        return <HideSplashScreen>{this.props.children}</HideSplashScreen>;
      case status.ERROR:
        return <ServerStatus variant="error" />;
      default:
        log("render", this.state.serverStatus);
        return <ServerStatus variant="waiting" />;
    }
  }
}

export default withPermissions(AppLoading);
