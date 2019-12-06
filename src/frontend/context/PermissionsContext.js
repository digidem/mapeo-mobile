// @flow
import * as React from "react";
import { Permissions } from "react-native-unimodules";
import debug from "debug";
import hoistStatics from "hoist-non-react-statics";

import { getDisplayName } from "../lib/utils";

const log = debug("mapeo:Permissions");

export type PermissionResult = "granted" | "denied" | "never_ask_again";

type PermissionType = typeof Permissions.CAMERA | typeof Permissions.LOCATION;

export type PermissionsType = {|
  [PermissionType]: PermissionResult
|};

export const RESULTS: { [string]: PermissionResult } = {
  GRANTED: "granted",
  DENIED: "denied",
  NEVER_ASK_AGAIN: "never_ask_again"
};

export const PERMISSIONS: { [string]: PermissionType } = {
  CAMERA: Permissions.CAMERA,
  LOCATION: Permissions.LOCATION
};

type RequestPermissions = (type: PermissionType | PermissionType[]) => any;

type PermissionsContextType = {|
  // Call with a string or array of strings of the permissions to request
  requestPermissions: RequestPermissions,
  // An object map of permissions and the current status, which can be "granted"
  // | "denied" | "never_ask_again"
  permissions: PermissionsType
|};

type Props = {
  children: React.Node
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
  permissions: initialPermissions
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
    permissions: initialPermissions
  };

  async requestPermissions(permissions: PermissionType | PermissionType[]) {
    if (!Array.isArray(permissions)) permissions = [permissions];
    for (const permission of permissions) {
      console.log("Requesting permission for:", permission);
      const { status } = await Permissions.askAsync(permission);
      log("Permission status", status);
      // Bail if nothing to update
      if (this.state.permissions[permission] === status) return;
      this.setState({
        permissions: {
          ...this.state.permissions,
          [permission]: status
        }
      });
    }
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
