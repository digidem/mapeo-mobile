import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { NavigationEventSubscription } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";

/**
 * Similar to `react-navigation/core`'s [`useIsFocused`](https://reactnavigation.org/docs/use-is-focused/)
 * but considers the screen to be focused only when:
 * 1) the screen animation finishes (as opposed to when the animation starts)
 * 2) the app is not in the background
 */
export const useIsFullyFocused = () => {
  const navigation = useNavigation();
  const navSubscriptions = useRef<NavigationEventSubscription[]>([]);

  const [isNavigationFullyFocused, setIsNavigationFullyFocused] = useState(
    navigation.isFocused()
  );
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active"
  );

  useEffect(() => {
    const onAppStateChange = (nextAppState: AppStateStatus) =>
      setIsAppActive(nextAppState === "active");

    AppState.addEventListener("change", onAppStateChange);

    return () => AppState.removeEventListener("change", onAppStateChange);
  }, []);

  useEffect(() => {
    if (navSubscriptions.current.length === 0) {
      navSubscriptions.current = [
        navigation.addListener("didFocus", () =>
          setIsNavigationFullyFocused(true)
        ),
        navigation.addListener("didBlur", () =>
          setIsNavigationFullyFocused(false)
        ),
      ];
    }

    return () => {
      navSubscriptions.current.forEach(s => s.remove());
      navSubscriptions.current = [];
    };
  }, [navigation]);

  return isNavigationFullyFocused && isAppActive;
};
