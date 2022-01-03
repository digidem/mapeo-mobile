import * as React from "react";
import { Permission, PermissionsAndroid, PermissionStatus } from "react-native";
import debug from "debug";
import shallowequal from "shallowequal";

const log = debug("mapeo:Permissions");

export type PermissionResult = PermissionStatus;

type RelevantAndroidPermission = Extract<
  Permission,
  | "android.permission.CAMERA"
  | "android.permission.ACCESS_FINE_LOCATION"
  | "android.permission.ACCESS_COARSE_LOCATION"
>;

export type PermissionsType = {
  [p in RelevantAndroidPermission]: PermissionResult;
};

export interface PermissionsContextType {
  // An object map of permissions and the current status
  // which can be "granted"  | "denied" | "never_ask_again"
  permissions: PermissionsType;
  // Call with a string or array of strings of the permissions to request
  requestPermissions: (
    type: RelevantAndroidPermission | RelevantAndroidPermission[]
  ) => Promise<void>;
}

export const RESULTS: { [key: string]: PermissionResult } = {
  GRANTED: "granted",
  DENIED: "denied",
  NEVER_ASK_AGAIN: "never_ask_again",
} as const;

export const PERMISSIONS: { [key: string]: RelevantAndroidPermission } = {
  CAMERA: "android.permission.CAMERA",
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
  ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
} as const;

const INITIAL_PERMISSIONS = Object.values(PERMISSIONS).reduce((acc, val) => {
  acc[val] = "denied";
  return acc;
}, {} as PermissionsType);

const PermissionsContext = React.createContext<PermissionsContextType>({
  requestPermissions: async () => {},
  permissions: INITIAL_PERMISSIONS,
});

/**
 * The PermissionsProvider is responsible for requesting app permissions and
 * stores the current status of the permissions granted by the user.
 */
export const PermissionsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [permissions, setPermissions] = React.useState<PermissionsType>(
    INITIAL_PERMISSIONS
  );

  const requestPermissions = React.useCallback(
    async (
      requestedPermissions:
        | RelevantAndroidPermission
        | RelevantAndroidPermission[]
    ) => {
      const status: PermissionsType = await PermissionsAndroid.requestMultiple(
        Array.isArray(requestedPermissions)
          ? requestedPermissions
          : [requestedPermissions]
      );

      log("Permission status", status);

      setPermissions(previous =>
        // Bail if nothing to update
        shallowequal(previous, status) ? previous : { ...previous, ...status }
      );
    },
    []
  );

  const contextValue = React.useMemo(
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

export const PermissionsConsumer = PermissionsContext.Consumer;
