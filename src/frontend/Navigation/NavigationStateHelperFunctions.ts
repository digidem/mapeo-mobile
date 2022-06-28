import { InitialState, NavigationState } from "@react-navigation/native";
import debug from "debug";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EDITING_SCREEN_NAMES,
  ERROR_STORE_KEY,
  NAV_STORE_KEY,
  NO_PRACTICE_BAR,
  TEMP_HIDE_PRACTICE_MODE_UI,
} from "../constants";
import { featureFlagOn } from "../lib/DevExperiments";
import bugsnag from "@bugsnag/react-native";

export function persistNavigationState(
  log: debug.Debugger,
  navState?: NavigationState
) {
  if (featureFlagOn) return;
  try {
    if (!navState)
      throw new Error("Navigation state is undefined while trying to save it");
    AsyncStorage.setItem(NAV_STORE_KEY, JSON.stringify(navState));
  } catch (err) {
    log("Error saving navigation state", err);
  }
}

export async function loadSavedNavState(log: debug.Debugger) {
  try {
    const navState = JSON.parse(
      (await AsyncStorage.getItem(NAV_STORE_KEY)) as string
    );
    const didCrashLastOpen = JSON.parse(
      (await AsyncStorage.getItem(ERROR_STORE_KEY)) as string
    );
    // Clear error saved state so that navigation persistence happens on next load
    await AsyncStorage.setItem(ERROR_STORE_KEY, JSON.stringify(false));
    // If the app crashed last time, don't restore nav state
    if (didCrashLastOpen) {
      bugsnag.leaveBreadcrumb("Crash on last open");
      log("Crashed on last open, skipping load of navigation state");
      return undefined;
    } else {
      return (navState as InitialState) || undefined;
    }
  } catch (error) {
    bugsnag.leaveBreadcrumb("Error loading nav state", { error });
    log("Error reading navigation and error state", error);
  }
}

export function getRouteName(navState?: NavigationState) {
  return !!navState ? navState.routes[navState.index].name : null;
}

export function inviteModalDisabledOnRoute(routeName: string | null) {
  return routeName !== null && EDITING_SCREEN_NAMES.includes(routeName);
}

export function hidePracticeBarForRoute(route: string | null) {
  return route !== null && NO_PRACTICE_BAR.includes(route);
}

export function hidePracticeModeTemporarily(route: string | null) {
  return route !== null && TEMP_HIDE_PRACTICE_MODE_UI.includes(route);
}
