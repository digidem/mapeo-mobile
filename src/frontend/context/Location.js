// @flow
import * as React from "react";
import { Constants, Permissions } from "@unimodules/core";
import * as Location from "expo-location";
import debug from "debug";

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

type ContextType = {
  position?: PositionType,
  provider?: ProviderType,
  permission?: "granted" | "denied",
  error?: boolean
};

type Props = {
  children: React.Node
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
} = React.createContext<ContextType>({});

class LocationProvider extends React.Component<Props, ContextType> {
  state = {
    error: false
  };

  _isMounted: boolean;
  watch: { remove: () => null };
  timeoutId: TimeoutID;

  async componentDidMount() {
    // Track this in case the component unmounts before the async functions
    // return and we shouldn't set state. This will be easier with hooks.
    this._isMounted = true;
    let provider: ProviderType | void;

    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (!this._isMounted) return;
      if (status === "granted") {
        provider = await Location.getProviderStatusAsync();
      }
      if (!this._isMounted) return;
      if (provider && provider.locationServicesEnabled) {
        this.watch = await Location.watchPositionAsync(
          positionOptions,
          this.onPosition
        );
      }
      // bail before setState if we've unmounted
      if (!this._isMounted) return;
      this.setState({ provider, permission: status });
    } catch (err) {
      log("Error reading position", err);
      if (!this._isMounted) return;
      this.setState({ error: true });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.watch) this.watch.remove();
  }

  onPosition = (position: PositionType) => {
    // The user can turn off location services via the quick settings dropdown
    // (swiping down from the top of their phone screen) without moving away
    // from the app. In this case the location will just stop updating and we
    // won't know why. If we haven't had a location update for a while, we check
    // on the provider status to see if location services are enabled, so that
    // we can update the state with the current status
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.checkProviderStatus, LOCATION_TIMEOUT);
    this.setState({ position });
  };

  checkProviderStatus = async () => {
    const provider = await Location.getProviderStatusAsync();
    if (!this._isMounted) return;
    if (!provider.locationServicesEnabled) {
      // Not enabled? Check again in a bit
      this.timeoutId = setTimeout(this.checkProviderStatus, LOCATION_TIMEOUT);
    }
    this.setState({ provider });
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

const withLocation = (Component: any) => (props: any) => (
  <LocationConsumer>
    {location => <Component {...props} location={location} />}
  </LocationConsumer>
);

export { LocationProvider, LocationConsumer, withLocation };
