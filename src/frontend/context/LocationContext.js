// @flow
import * as React from "react";
import * as Location from "expo-location";
import debug from "debug";

import { withPermissions, PERMISSIONS, RESULTS } from "./PermissionsContext";
import type { PermissionResult, PermissionsType } from "./PermissionsContext";

const log = debug("mapeo:Location");

type PositionType = {
  timestamp: number,
  mocked: boolean,
  coords: {
    altitude?: number,
    heading?: number,
    longitude?: number,
    speed?: number,
    latitude?: number,
    accuracy?: number
  }
};

type ProviderType = {
  gpsAvailable: boolean,
  passiveAvailable: boolean,
  locationServicesEnabled: boolean,
  networkAvailable: boolean
};

export type LocationContextType = {
  position?: PositionType,
  provider?: ProviderType,
  permission?: PermissionResult,
  error: boolean
};

type Props = {
  children: React.Node,
  permissions: PermissionsType
};

const defaultContext = {
  error: false
};

const positionOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000
};

// Timeout between location updates --> means location was probably turned off
// so we need to check it.
const LOCATION_TIMEOUT = 10000;

const {
  Provider,
  Consumer: LocationConsumer
} = React.createContext<LocationContextType>(defaultContext);

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

  componentDidMount() {
    this.updateStatus();
  }

  componentDidUpdate(prevProps) {
    const { permissions } = this.props;
    const permissionHasChanged =
      permissions[PERMISSIONS.ACCESS_FINE_LOCATION] !==
      prevProps.permissions[PERMISSIONS.ACCESS_FINE_LOCATION];
    if (permissionHasChanged) this.updateStatus();
  }

  async updateStatus() {
    try {
      const hasLocationPermission =
        this.props.permissions[PERMISSIONS.ACCESS_FINE_LOCATION] ===
        RESULTS.GRANTED;
      if (!hasLocationPermission) return;
      const provider = await Location.getProviderStatusAsync();
      if (this._watch) return;
      if (provider && provider.locationServicesEnabled) {
        this._watch = await Location.watchPositionAsync(
          positionOptions,
          this.onPosition
        );
      }
      this.setState({ provider });
    } catch (err) {
      log("Error reading position", err);
      this.setState({ error: true });
    }
  }

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
    this._timeoutId = setTimeout(this.checkProviderStatus, LOCATION_TIMEOUT);
    this.setState({ position });
  };

  checkProviderStatus = async () => {
    const provider = await Location.getProviderStatusAsync();
    if (!provider.locationServicesEnabled) {
      // Not enabled? Check again in a bit
      this._timeoutId = setTimeout(this.checkProviderStatus, LOCATION_TIMEOUT);
    }
    this.setState({ provider });
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
