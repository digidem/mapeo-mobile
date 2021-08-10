import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus, InteractionManager } from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

/**
 * Similar to `react-navigation/core`'s [`useIsFocused`](https://reactnavigation.org/docs/use-is-focused/)
 * but considers the screen to be focused only when:
 * 1) the screen animation finishes (as opposed to when the animation starts)
 * 2) the app is not in the background
 */
export const useIsFullyFocused = (): boolean => {
  const isFocused = useIsFocused();

  const [isNavigationFullyFocused, setIsNavigationFullyFocused] = useState(
    isFocused
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

  useFocusEffect(
    useCallback(() => {
      // We use the the InteractionManager so that the effect only runs after the transition finishes
      // https://reactnavigation.org/docs/use-focus-effect#delaying-effect-until-transition-finishes
      const task = InteractionManager.runAfterInteractions(() => {
        setIsNavigationFullyFocused(true);
      });

      return () => {
        task.cancel();
        setIsNavigationFullyFocused(false);
      };
    }, [])
  );

  return isAppActive && isNavigationFullyFocused;
};
