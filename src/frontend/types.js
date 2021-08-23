// @flow
import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationNavigateAction,
  NavigationAction,
} from "react-navigation";

export type {
  ViewStyleProp,
  TextStyleProp,
  ImageStyleProp,
} from "react-native/Libraries/StyleSheet/StyleSheet";

export type IconSize = "small" | "medium" | "large";
export type ImageSize = "thumbnail" | "preview" | "original";

export type MapStyle = {
  id: string,
  name: string,
  bounds: number[],
  minzoom: number,
  maxzoom: number,
};
export type UseState<S> = [S, ((S => S) | S) => void];
export type Status = "idle" | "loading" | "error" | "success" | void;

type NavigationParams = {|
  observationId?: string,
  question: number,
  photoIndex?: number,
  editing?: boolean,
  handleSavePress?: () => any,
|};

type StackNavigatorProps = {|
  pop: (n?: number, params?: { immediate?: boolean }) => boolean,
  popToTop: (params?: { immediate?: boolean }) => boolean,
  push: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction
  ) => boolean,
  replace: (
    routeName: string,
    params?: NavigationParams,
    action?: NavigationNavigateAction
  ) => boolean,
  reset: (actions: NavigationAction[], index: number) => boolean,
  dismiss: () => boolean,
|};

type NavigationState = {|
  ...NavigationRoute,
  params: NavigationParams,
|};

export type NavigationProp = {|
  ...$Exact<NavigationScreenProp<NavigationState>>,
  ...StackNavigatorProps,
|};
