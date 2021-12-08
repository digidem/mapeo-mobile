import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";

import api, { Constants, ServerStatus } from "./api";
import { PERMISSIONS } from "./context/PermissionsContext";
import { usePermissions } from "./hooks/usePermissions";
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

  const [serverStatus, setServerStatus] = React.useState<ServerStatus>(null);

  const timeoutId = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      if (!timeoutId.current) return;
      window.clearTimeout(timeoutId.current);
      SplashScreen.hide();
    };
  }, []);

  React.useEffect(() => {
    const handleStatusChange = (newServerStatus: ServerStatus) => {
      setServerStatus(previous => {
        if (previous === newServerStatus) {
          return previous;
        } else {
          log("status change", newServerStatus);
          return newServerStatus;
        }
      });
    };

    const stateSubscription = api.addServerStateListener(handleStatusChange);

    return () => stateSubscription.remove();
  }, []);

  React.useEffect(() => {
    requestPermissions(REQUESTED_PERMISSIONS);

    timeoutId.current = window.setTimeout(() => {
      SplashScreen.hide();
      timeoutId.current = undefined;
      log("hiding splashscreen");
    }, 1000);
  }, [requestPermissions]);

  React.useEffect(() => {
    if (!serverStatus) {
      api.startServer();
      setServerStatus(Constants.STARTING);
    }
  }, [serverStatus]);

  if (!serverStatus) return null;
  else if (serverStatus === Constants.ERROR) {
    return <ServerStatusScreen variant="error" />;
  } else if (serverStatus === Constants.TIMEOUT) {
    return <ServerStatusScreen variant="timeout" />;
  } else {
    return children;
  }
};
