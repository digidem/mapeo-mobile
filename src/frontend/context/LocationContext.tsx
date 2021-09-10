import * as React from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-community/async-storage";
import { Position, Provider } from "mapeo-schema";
import debug from "debug";

import { PERMISSIONS, RESULTS, PermissionResult } from "./PermissionsContext";
import { usePermissions } from "../hooks/usePermissions";

const log = debug("mapeo:Location");
const STORE_KEY = "@MapeoPosition@1";

export type LocationContextType = {
  // If available, details of the current position
  position?: Position;
  // What location services / providers are available on this device
  provider?: Provider;
  // Whether the user has granted permissions to use location to this app
  permission?: PermissionResult;
  // This is the previous known position from the last time the app was open
  savedPosition?: Position | null;
  // True if there is some kind of error getting the device location
  error?: boolean;
};

interface Subscription {
  remove: () => void;
}

const DEFAULT_CONTEXT: LocationContextType = {
  error: false,
};

const positionOptions = {
  // See https://docs.expo.io/versions/v32.0.0/sdk/location/#locationaccuracy
  // this is the best possible accuracy using GPS and other sensors
  accuracy: Location.Accuracy.BestForNavigation,
  // This is the interval between location updates. We should get a new GPS
  // reading every 2000ms.
  timeInterval: 2000,
};

// Timeout between location updates --> means location was probably turned off
// so we need to check it.
const LOCATION_TIMEOUT = 10000;

const stopWatchingLocation = (
  timeoutIdRef: React.MutableRefObject<number | undefined>,
  subscriptionRef: React.MutableRefObject<Subscription | undefined>
) => {
  log("Stopping GPS watch");
  if (subscriptionRef.current) subscriptionRef.current.remove();
  if (timeoutIdRef.current) window.clearTimeout(timeoutIdRef.current);
  subscriptionRef.current = undefined;
};

const LocationContext: React.Context<LocationContextType> = React.createContext<
  LocationContextType
>(DEFAULT_CONTEXT);

/**
 * The LocationProvider provides details about the current device location based
 * on sensors including GPS. It must be included in the component heirarchy
 * below the PermissionsProvider, since it needs to read the permissions granted
 * for device location. There is no event we can listen to for when the user
 * switches off location (e.g. changes to airplane mode) so we use a timeout ->
 * if we get not new readings for 10 seconds then we check to see whether the
 * user has turned off location.
 */
export const LocationProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { permissions } = usePermissions();
  const [error, setError] = React.useState(false);
  const [savedPosition, setSavedPosition] = React.useState<Position>();
  const [position, setPosition] = React.useState<Position>();
  const [provider, setProvider] = React.useState<Provider>();

  const timeoutId = React.useRef<number>();
  const subscription = React.useRef<Subscription>();

  const fineLocationPermissionResult = permissions[
    PERMISSIONS.ACCESS_FINE_LOCATION
  ] as PermissionResult;

  const updateStatus = React.useCallback(async () => {
    try {
      if (fineLocationPermissionResult !== RESULTS.GRANTED) return;

      if (timeoutId.current) window.clearTimeout(timeoutId.current);

      const providerStatus = await Location.getProviderStatusAsync();

      if (
        providerStatus &&
        providerStatus.locationServicesEnabled &&
        !subscription.current
      ) {
        subscription.current = await Location.watchPositionAsync(
          positionOptions,
          location => {
            // The user can turn off location services via the quick settings dropdown
            // (swiping down from the top of their phone screen) without moving away
            // from the app. In this case the location will just stop updating and we
            // won't know why. If we haven't had a location update for a while, we check
            // on the provider status to see if location services are enabled, so that
            // we can update the state with the current status
            if (timeoutId.current) window.clearTimeout(timeoutId.current);
            timeoutId.current = window.setTimeout(
              updateStatus,
              LOCATION_TIMEOUT
            );
            setPosition(location as Position);
          }
        );
      } else {
        subscription.current?.remove();
        subscription.current = undefined;
        timeoutId.current = window.setTimeout(updateStatus, LOCATION_TIMEOUT);
      }
      // If location services are disabled, clear the position stored in state,
      // so that we don't create observations with a stale position.
      if (!providerStatus || !providerStatus.locationServicesEnabled) {
        setPosition(undefined);
      }

      setProvider(providerStatus);
    } catch (err) {
      if (err instanceof Error) {
        log("Error reading position", err);
        setError(true);
        setPosition(undefined);
      }
    }
  }, [fineLocationPermissionResult]);

  React.useEffect(() => {
    return () => stopWatchingLocation(timeoutId, subscription);
  }, []);

  React.useEffect(() => {
    const loadInitialSavedPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(STORE_KEY);
        setSavedPosition(
          savedPosition == null ? null : JSON.parse(savedPosition)
        );
      } catch (err) {
        log("Error reading storage", err);
      }
    };

    loadInitialSavedPosition();
  }, []);

  React.useEffect(() => {
    if (position) {
      try {
        AsyncStorage.setItem(STORE_KEY, JSON.stringify(position));
      } catch (err) {
        log("Error writing to storage", err);
      }
    }
  }, [position]);

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        updateStatus();
      } else {
        stopWatchingLocation(timeoutId, subscription);
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, [updateStatus]);

  React.useEffect(() => {
    updateStatus();
  }, [fineLocationPermissionResult, updateStatus]);

  const contextValue = React.useMemo(
    () => ({
      error,
      permission: fineLocationPermissionResult,
      position,
      provider,
      savedPosition,
    }),
    [error, fineLocationPermissionResult, position, provider, savedPosition]
  );

  return savedPosition === undefined ? null : (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
