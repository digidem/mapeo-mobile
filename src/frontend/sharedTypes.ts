// TS port of /src/frontend/types.js
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { NavigationRoute } from "react-navigation";
import {
  NavigationStackProp,
  NavigationStackScreenComponent,
} from "react-navigation-stack";
import { AppStackList } from "./Navigation/AppStack";

export type ViewStyleProp = StyleProp<ViewStyle>;
export type TextStyleProp = StyleProp<TextStyle>;
export type ImageStyleProps = StyleProp<ImageStyle>;

export type MapStyle = {
  id: string;
  name: string;
  bounds: number[];
  minzoom: number;
  maxzoom: number;
};

export type IconSize = "small" | "medium" | "large";
export type ImageSize = "thumbnail" | "preview" | "original";

export type Status = "idle" | "loading" | "error" | "success" | void;

type NavigationParams = {
  observationId?: string;
  question: number;
  photoIndex?: number;
  editing?: boolean;
  handleSavePress?: () => void;
};

export type NavigationProp = NavigationStackProp<
  NavigationRoute,
  NavigationParams
>;

export type StackScreenComponent = NavigationStackScreenComponent<
  NavigationParams
>;

type NavKeys = keyof AppStackList;

export type NativeNavigationProp<
  ScreenName extends NavKeys
> = NativeStackScreenProps<AppStackList, ScreenName>;
