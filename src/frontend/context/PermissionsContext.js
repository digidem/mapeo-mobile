// @flow
import * as React from "react";
import { PermissionsAndroid } from "react-native";
import debug from "debug";

import { getDisplayName } from "../lib/utils";

const log = debug("mapeo:Permissions");

export type PermissionResult = "granted" | "denied" | "never_ask_again";

type PermissionType =
  | "android.permission.CAMERA"
  | "android.permission.ACCESS_FINE_LOCATION"
  | "android.permission.ACCESS_COARSE_LOCATION"
  | "android.permission.READ_EXTERNAL_STORAGE"
  | "android.permission.WRITE_EXTERNAL_STORAGE";

export type PermissionsType = {|
  [PermissionType]: PermissionResult
|};

export const RESULTS: { [string]: PermissionResult } = {
  GRANTED: "granted",
  DENIED: "denied",
  NEVER_ASK_AGAIN: "never_ask_again"
};

export const PERMISSIONS: { [string]: PermissionType } = {
  CAMERA: "android.permission.CAMERA",
  ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
  ACCESS_COARSE_LOCATION: "android.permission.ACCESS_COARSE_LOCATION",
  READ_EXTERNAL_STORAGE: "android.permission.READ_EXTERNAL_STORAGE",
  WRITE_EXTERNAL_STORAGE: "android.permission.WRITE_EXTERNAL_STORAGE"
};

type RequestPermissions = (type: PermissionType | PermissionType[]) => any;

type PermissionsContextType = {|
  requestPermissions: RequestPermissions,
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

const {
  Provider,
  Consumer: PermissionsConsumer
} = React.createContext<PermissionsContextType>({
  requestPermissions: () => {},
  permissions: initialPermissions
});

class PermissionsProvider extends React.Component<
  Props,
  PermissionsContextType
> {
  state = {
    requestPermissions: this.requestPermissions.bind(this),
    permissions: initialPermissions
  };

  _isMounted: boolean;

  componentDidMount() {
    // Track this in case the component unmounts before the async functions
    // return and we shouldn't set state. This will be easier with hooks.
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async requestPermissions(permissions: PermissionType | PermissionType[]) {
    if (!Array.isArray(permissions)) permissions = [permissions];
    // $FlowFixMe
    const status = await PermissionsAndroid.requestMultiple(permissions);
    log("Permission status", status);
    if (!this._isMounted) return;
    this.setState({
      permissions: {
        ...this.state.permissions,
        ...status
      }
    });
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const withPermissions = (WrappedComponent: any) => {
  const WithPermissions = (props: any) => (
    <PermissionsConsumer>
      {permissionsContext => (
        <WrappedComponent {...props} {...permissionsContext} />
      )}
    </PermissionsConsumer>
  );
  WithPermissions.displayName = `WithPermissions(${getDisplayName(
    WrappedComponent
  )})`;
  return WithPermissions;
};

export default {
  Provider: PermissionsProvider,
  Consumer: PermissionsConsumer
};
