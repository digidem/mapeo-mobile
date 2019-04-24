// @flow
import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-community/async-storage";
import debug from "debug";

import { withPermissions, PERMISSIONS, RESULTS } from "./PermissionsContext";
import type { PermissionResult, PermissionsType } from "./PermissionsContext";

const log = debug("mapeo:Location");
const STORE_KEY = "@MapeoPosition";

type PositionType = {
  // The timestamp of when the current position was obtained
  timestamp: number,
  // Whether the position is mocked or not
  mocked: boolean,
  // Position details, should be self explanatory. Units in meters
  coords: {
    altitude: number,
    heading: number,
    longitude: number,
    speed: number,
    latitude: number,
    accuracy: number
  }
};

type ProviderType = {
  // Whether the user has enabled GPS for device location (this is not the same
  // as turning location services off, this is a setting whether to use just
  // wifi and bluetooth or use GPS for location)
  gpsAvailable: boolean,
  // Whether the device can lookup location based on wifi and bluetooth networks
  passiveAvailable: boolean,
  // Has the user enabled location services on the device (this is often turned
  // off when the device is in airplane mode)
  locationServicesEnabled: boolean,
  // Whether the device can lookup location based on cell phone towers
  networkAvailable: boolean
};

export type LocationContextType = {
  // If available, details of the current position
  position?: PositionType,
  // What location services / providers are available on this device
  provider?: ProviderType,
  // Whether the user has granted permissions to use location to this app
  permission?: PermissionResult,
  // This is the previous known position from the last time the app was open
  savedPosition?: PositionType,
  // True if there is some kind of error getting the device location
  error: boolean
};

type Props = {
  children: React.Node,
  permissions: PermissionsType
};

const defaultContext: LocationContextType = {
  error: false
};

const positionOptions = {
  // See https://docs.expo.io/versions/v32.0.0/sdk/location/#locationaccuracy
  // this is the best possible accuracy using GPS and other sensors
  accuracy: Location.Accuracy.BestForNavigation,
  // This is the interval between location updates. We should get a new GPS
  // reading every 2000ms.
  timeInterval: 2000
};

// Timeout between location updates --> means location was probably turned off
// so we need to check it.
const LOCATION_TIMEOUT = 10000;

const {
  Provider,
  Consumer: LocationConsumer
} = React.createContext<LocationContextType>(defaultContext);

/**
 * The LocationProvider provides details about the current device location based
 * on sensors including GPS. It must be included in the component heirarchy
 * below the PermissionsProvider, since it needs to read the permissions granted
 * for device location. There is no event we can listen to for when the user
 * switches off location (e.g. changes to airplane mode) so we use a timeout ->
 * if we get not new readings for 10 seconds then we check to see whether the
 * user has turned off location.
 */
class LocationProvider extends React.Component<Props, LocationContextType> {
  _watch: null | { remove: () => null };
  _timeoutId: TimeoutID;

  // This React method is "bad" to use, but we use it for convenience - we
  // include the location permission state in the location context object
  static getDerivedStateFromProps(props, state) {
    if (
      props.permissions[PERMISSIONS.ACCESS_FINE_LOCATION] === state.permission
    )
      return state;
    return {
      ...state,
      permission: props.permissions[PERMISSIONS.ACCESS_FINE_LOCATION]
    };
  }

  state = defaultContext;
  _watch = null;

  async componentDidMount() {
    this.updateStatus();
    try {
      const savedPosition = await AsyncStorage.getItem(STORE_KEY);
      if (savedPosition != null && !this.state.position) {
        this.setState({ savedPosition: JSON.parse(savedPosition) });
      }
    } catch (e) {
      log("Error reading storage", e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { permissions } = this.props;
    const { position } = this.state;
    const permissionHasChanged =
      permissions[PERMISSIONS.ACCESS_FINE_LOCATION] !==
      prevProps.permissions[PERMISSIONS.ACCESS_FINE_LOCATION];
    if (permissionHasChanged) this.updateStatus();
    if (position !== prevState.position && position) {
      try {
        AsyncStorage.setItem(STORE_KEY, JSON.stringify(position));
      } catch (e) {
        log("Error writing to storage", e);
      }
    }
  }

  updateStatus = async () => {
    try {
      const hasLocationPermission =
        this.props.permissions[PERMISSIONS.ACCESS_FINE_LOCATION] ===
        RESULTS.GRANTED;
      if (!hasLocationPermission) return;
      clearTimeout(this._timeoutId);
      const provider = await Location.getProviderStatusAsync();
      if (provider && provider.locationServicesEnabled && !this._watch) {
        this._watch = await Location.watchPositionAsync(
          positionOptions,
          this.onPosition
        );
      } else {
        if (this._watch) this._watch.remove();
        this._watch = null;
        this._timeoutId = setTimeout(this.updateStatus, LOCATION_TIMEOUT);
      }
      this.setState({ provider });
    } catch (err) {
      log("Error reading position", err);
      this.setState({ error: true });
    }
  };

  componentWillUnmount() {
    if (this._watch) this._watch.remove();
    clearTimeout(this._timeoutId);
    this._watch = null;
  }

  onPosition = (position: PositionType) => {
    // The user can turn off location services via the quick settings dropdown
    // (swiping down from the top of their phone screen) without moving away
    // from the app. In this case the location will just stop updating and we
    // won't know why. If we haven't had a location update for a while, we check
    // on the provider status to see if location services are enabled, so that
    // we can update the state with the current status
    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(this.updateStatus, LOCATION_TIMEOUT);
    this.setState({ position });
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const withLocation = (WrappedComponent: any) => {
  const WithLocation = (props: any) => (
    <LocationConsumer>
      {location => <WrappedComponent {...props} location={location} />}
    </LocationConsumer>
  );
  WithLocation.displayName = `WithLocation(${getDisplayName(
    WrappedComponent
  )})`;
  return WithLocation;
};

export default {
  Provider: withPermissions(LocationProvider),
  Consumer: LocationConsumer
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
