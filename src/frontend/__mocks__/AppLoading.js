// @flow
import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";

import api, { Constants } from "./api";
import ServerStatusScreen from "../screens/ServerStatus";
import { withPermissions, PERMISSIONS } from "../context/PermissionsContext";
import type { ServerStatus } from "./api";

const log = debug("mapeo:AppLoading");

type Props = {
  children: React.Node,
};

type State = {
  serverStatus: ServerStatus | null,
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
  _timeoutId: TimeoutID | null;
  _subscription: { remove: () => any };
  state = {
    serverStatus: null,
  };

  componentDidMount() {
    // $FlowFixMe - needs HOC type to be fixed
    this.props.requestPermissions([
      PERMISSIONS.CAMERA,
      PERMISSIONS.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    this._timeoutId = setTimeout(() => {
      SplashScreen.hide();
      this._timeoutId = null;
      log("hiding splashscreen");
    }, 1000);
    this._subscription = api.addServerStateListener(this.handleStatusChange);
  }

  componentDidUpdate() {
    if (this.state.serverStatus == null) {
      api.startServer();
      this.setState({ serverStatus: Constants.STARTING });
    }
  }

  componentWillUnmount() {
    this._subscription.remove();
    if (!this._timeoutId) return;
    clearTimeout(this._timeoutId);
    SplashScreen.hide();
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
