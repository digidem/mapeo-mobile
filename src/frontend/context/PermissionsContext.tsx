import * as React from "react";
import { PermissionsAndroid, Platform } from "react-native";
import debug from "debug";
import shallowequal from "shallowequal";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

const log = debug("mapeo:Permissions");

export const RESULTS = {
  GRANTED: "granted",
  DENIED: "denied",
  NEVER_ASK_AGAIN: "never_ask_again",
} as const;

export const PERMISSIONS = {
  CAMERA: "android.permission.CAMERA",
  ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
} as const;

type ValueOf<T> = T[keyof T];

type Permission = ValueOf<typeof PERMISSIONS>;
export type PermissionResult = ValueOf<typeof RESULTS>;

export type PermissionsWithResult = Record<Permission, PermissionResult>;

type RequestPermissions = (type: Permission | Permission[]) => void;

type PermissionsContextType = {
  // Call with a string or array of strings of the permissions to request
  requestPermissions: RequestPermissions;
  // An object map of permissions and the current status, which can be "granted"
  // | "denied" | "never_ask_again"
  permissions: PermissionsWithResult;
};

const initialPermissions = Object.values(PERMISSIONS).reduce((acc, val) => {
  acc[val] = "denied";
  return acc;
}, {} as PermissionsWithResult);

const PermissionsContext = React.createContext<PermissionsContextType>({
  requestPermissions: () => {},
  permissions: initialPermissions,
});

export const usePermissions = () => {
  const permissions = React.useContext(PermissionsContext);
  return permissions;
};

export const PermissionsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [permissions, setPermissions] = React.useState<PermissionsWithResult>(
    initialPermissions
  );

  const requestPermissions = React.useCallback(
    async (permissionsToRequest: Permission | Permission[]) => {
      if (Platform.OS === "android") {
        if (!Array.isArray(permissionsToRequest))
          permissionsToRequest = [permissionsToRequest];

        const status = await PermissionsAndroid.requestMultiple(
          permissionsToRequest
        );

        log("Permission status", status);

        setPermissions(previous => {
          // Bail if nothing to update
          if (shallowequal(previous, status)) {
            return previous;
          } else {
            return { ...previous, ...status };
          }
        });
      } else if (Platform.OS === "ios") {
        // TODO: Request necessary permissions
        const cameraPermission = await Camera.requestPermissionsAsync();
        const locationPermission = await Location.requestForegroundPermissionsAsync();

        console.log("IOS PERMISSIONS", {
          camera: cameraPermission,
          location: locationPermission,
        });

        return;
      }
    },
    []
  );

  const contextValue: PermissionsContextType = React.useMemo(
    () => ({ permissions, requestPermissions }),
    [permissions, requestPermissions]
  );

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
