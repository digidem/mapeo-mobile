import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";

import { Constants } from "./api";
import { PERMISSIONS } from "./context/PermissionsContext";
import { usePermissions } from "./hooks/usePermissions";
import { useServerStatus } from "./hooks/useServerStatus";
import ServerStatusScreen from "./screens/ServerStatus";

const log = debug("mapeo:AppLoading");

const REQUESTED_PERMISSIONS = [
  PERMISSIONS.CAMERA,
  PERMISSIONS.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ACCESS_FINE_LOCATION,
];

/**
 * Listens to the nodejs-mobile process and only renders children when the
 * server is up and running and listening.
 * On initial app load it waits for the server before dismissing the native
 * splash screen.
 * If it doesn't hear a heartbeat message for timeout, it displays a screen to
 * the user so they know something is wrong.
 */
export const AppLoading = ({ children }: React.PropsWithChildren<{}>) => {
  const { requestPermissions } = usePermissions();
  const serverStatus = useServerStatus();

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      SplashScreen.hide();
      log("hiding splashscreen");
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      SplashScreen.hide();
    };
  }, []);

  React.useEffect(() => {
    requestPermissions(REQUESTED_PERMISSIONS);
  }, [requestPermissions]);

  if (serverStatus === Constants.ERROR) {
    return <ServerStatusScreen variant="error" />;
  } else if (serverStatus === Constants.TIMEOUT) {
    return <ServerStatusScreen variant="timeout" />;
  } else {
    return children;
  }
};
