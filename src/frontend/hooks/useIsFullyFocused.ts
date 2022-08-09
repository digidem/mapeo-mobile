import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useNavigation } from "@react-navigation/native";
/**
 * Similar to `react-navigation/core`'s [`useIsFocused`](https://reactnavigation.org/docs/use-is-focused/)
 * but considers the screen to be focused only when:
 * 1) the screen animation finishes (as opposed to when the animation starts)
 * 2) the app is not in the background
 */
export const useIsFullyFocused = () => {
  const navigation = useNavigation();

  const [isNavigationFullyFocused, setIsNavigationFullyFocused] = useState(
    navigation.isFocused()
  );
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active"
  );

  useEffect(() => {
    const onAppStateChange = (nextAppState: AppStateStatus) =>
      setIsAppActive(nextAppState === "active");

    const changeSubscription = AppState.addEventListener(
      "change",
      onAppStateChange
    );

    return () => changeSubscription.remove();
  }, []);

  useEffect(() => {
    // let navSubscriptions: EventListenerCallback<any, any>  [] = [];

    const navSubscriptions = [
      navigation.addListener("focus", () => setIsNavigationFullyFocused(true)),
      navigation.addListener("blur", () => setIsNavigationFullyFocused(false)),
    ];

    return () => navSubscriptions.forEach(s => s());
  }, [navigation]);

  return isNavigationFullyFocused && isAppActive;
};
