// @flow
import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";

import api, { Constants } from "./api";
import ServerStatusScreen from "./screens/ServerStatus";
import {
  withPermissions,
  PERMISSIONS,
  RESULTS
} from "./context/PermissionsContext";
import type { ServerStatus } from "./api";

const log = debug("mapeo:AppLoading");

type Props = {
  children: React.Node
};

type State = {
  serverStatus: ServerStatus | null
};

/**
 * Listens to the nodejs-mobile process and only renders children when the
 * server is up and running and listening.
 * On initial app load it waits for the server before dismissing the native
 * splash screen.
 * If it doesn't hear a heartbeat message for timeout, it displays a screen to
 * the user so they know something is wrong.
 */
class AppLoading extends React.Component<Props, State> {
  timeoutId: TimeoutID | null;
  state = {
    serverStatus: null
  };

  componentDidMount() {
    // $FlowFixMe - needs HOC type to be fixed
    this.props.requestPermissions([
      PERMISSIONS.CAMERA,
      PERMISSIONS.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ACCESS_FINE_LOCATION,
      PERMISSIONS.READ_EXTERNAL_STORAGE,
      PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
    this.timeoutId = setTimeout(() => {
      SplashScreen.hide();
      this.timeoutId = null;
      log("hiding splashscreen");
    }, 500);
    this._sub = api.addServerStateListener(this.handleStatusChange);
  }

  componentDidUpdate() {
    if (this.hasStoragePermission() && this.state.serverStatus == null) {
      api.startServer();
      this.setState({ serverStatus: Constants.STARTING });
    }
  }

  componentWillUnmount() {
    this._sub.remove();
    if (!this.timeoutId) return;
    clearTimeout(this.timeoutId);
    SplashScreen.hide();
  }

  hasStoragePermission() {
    // $FlowFixMe - needs HOC type to be fixed
    const { permissions } = this.props;
    return (
      permissions[PERMISSIONS.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
      permissions[PERMISSIONS.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED
    );
  }

  handleStatusChange = (serverStatus: ServerStatus) => {
    if (serverStatus === this.state.serverStatus) return;
    log("status change", serverStatus);
    this.setState({ serverStatus });
  };

  render() {
    const { serverStatus } = this.state;
    if (serverStatus == null) return null;
    else if (serverStatus === Constants.ERROR) {
      return <ServerStatusScreen variant="error" />;
    } else if (serverStatus === Constants.TIMEOUT) {
      return <ServerStatusScreen variant="timeout" />;
    } else {
      return this.props.children;
    }
  }
}

export default withPermissions(AppLoading);
