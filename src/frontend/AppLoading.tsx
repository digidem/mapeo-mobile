import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";

import api, { Constants } from "./api";
import { usePermissions, PERMISSIONS } from "./context/PermissionsContext";
import ServerStatusScreen from "./screens/ServerStatus";

type ServerStatus = keyof typeof Constants;

const log = debug("mapeo:AppLoading");

const AppLoading = ({ children }: React.PropsWithChildren<{}>) => {
  const { requestPermissions } = usePermissions();

  const [serverStatus, setServerStatus] = React.useState<ServerStatus | null>(
    null
  );

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      SplashScreen.hide();
      log("hiding splashscreen");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    const handleStatusChange = (newStatus: ServerStatus) =>
      setServerStatus(previousStatus => {
        if (previousStatus === newStatus) {
          return previousStatus;
        } else {
          log("status change", serverStatus);
          return newStatus;
        }
      });

    // @ts-expect-error
    const subscription = api.addServerStateListener(handleStatusChange);

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    requestPermissions([
      PERMISSIONS.CAMERA,
      PERMISSIONS.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }, [requestPermissions]);

  if (serverStatus == null) {
    return null;
  } else if (serverStatus === Constants.ERROR) {
    return <ServerStatusScreen variant="error" />;
  } else if (serverStatus === Constants.TIMEOUT) {
    return <ServerStatusScreen variant="timeout" />;
  } else {
    return <>{children}</>;
  }
};

export default AppLoading;
