// @flow
import * as React from "react";
import { PermissionsAndroid, Platform } from "react-native";
import debug from "debug";
import shallowequal from "shallowequal";
import hoistStatics from "hoist-non-react-statics";

import { getDisplayName } from "../lib/utils";

const log = debug("mapeo:Permissions");

export type PermissionResult = "granted" | "denied" | "never_ask_again";

type PermissionType =
  | "android.permission.CAMERA"
  | "android.permission.ACCESS_FINE_LOCATION"
  | "android.permission.ACCESS_COARSE_LOCATION";

export type PermissionsType = {|
  [PermissionType]: PermissionResult,
|};

export const RESULTS: { [string]: PermissionResult } = {
  GRANTED: "granted",
  DENIED: "denied",
  NEVER_ASK_AGAIN: "never_ask_again",
};

export const PERMISSIONS: { [string]: PermissionType } = {
  CAMERA: "android.permission.CAMERA",
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
  ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
};

type RequestPermissions = (type: PermissionType | PermissionType[]) => any;

type PermissionsContextType = {|
  // Call with a string or array of strings of the permissions to request
  requestPermissions: RequestPermissions,
  // An object map of permissions and the current status, which can be "granted"
  // | "denied" | "never_ask_again"
  permissions: PermissionsType,
|};

type Props = {
  children: React.Node,
};

// $FlowFixMe
const initialPermissions: PermissionsType = Object.values(PERMISSIONS).reduce(
  (acc, val) => {
    // $FlowFixMe - val can only be a valid value
    acc[val] = "denied";
    return acc;
  },
  {}
);

const PermissionsContext = React.createContext<PermissionsContextType>({
  requestPermissions: () => {},
  permissions: initialPermissions,
});

/**
 * The PermissionsProvider is responsible for requesting app permissions and
 * stores the current status of the permissions granted by the user.
 */
export class PermissionsProvider extends React.Component<
  Props,
  PermissionsContextType
> {
  state = {
    requestPermissions: this.requestPermissions.bind(this),
    permissions: initialPermissions,
  };

  async requestPermissions(permissions: PermissionType | PermissionType[]) {
    if (Platform.OS !== "android") return;
    if (!Array.isArray(permissions)) permissions = [permissions];
    // $FlowFixMe see https://github.com/facebook/react-native/blob/4409642811c787052e0baeb92e2679a96002c1e3/Libraries/PermissionsAndroid/NativePermissionsAndroid.js#L16
    const status = await PermissionsAndroid.requestMultiple(permissions);
    log("Permission status", status);
    // Bail if nothing to update
    if (shallowequal(this.state.permissions, status)) return;
    this.setState({
      permissions: {
        ...this.state.permissions,
        // $FlowFixMe - not sure what to do about this, it's correct, flow just can't track it
        ...status,
      },
    });
  }

  render() {
    return (
      <PermissionsContext.Provider value={this.state}>
        {this.props.children}
      </PermissionsContext.Provider>
    );
  }
}

export const withPermissions = (WrappedComponent: any) => {
  const WithPermissions = (props: any) => (
    <PermissionsContext.Consumer>
      {permissionsContext => (
        <WrappedComponent {...props} {...permissionsContext} />
      )}
    </PermissionsContext.Consumer>
  );
  WithPermissions.displayName = `WithPermissions(${getDisplayName(
    WrappedComponent
  )})`;
  return hoistStatics(WithPermissions, WrappedComponent);
};

export default PermissionsContext;

export const PermissionsConsumer = PermissionsContext.Consumer;
