// TS port of /src/frontend/types.js
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { AppStackList, HomeTabsList } from "./Navigation/AppStack";

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

export type NativeRootNavigationProps<
  ScreenName extends keyof AppStackList
> = NativeStackScreenProps<AppStackList, ScreenName>;

export type NativeHomeTabsNavigationProps<
  ScreenName extends keyof HomeTabsList
> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsList, ScreenName>,
  NativeStackScreenProps<AppStackList>
>;
