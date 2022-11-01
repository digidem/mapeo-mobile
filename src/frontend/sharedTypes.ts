// TS port of /src/frontend/types.js
import { ImportsApi } from "@mapeo/map-server/dist/api/imports";
import { StylesApi } from "@mapeo/map-server/dist/api/styles";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { MessageDescriptor } from "react-intl";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { AppStackList } from "./Navigation/AppStack";
import { HomeTabsList } from "./Navigation/ScreenGroups/AppScreens";

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

type Title = { title: string };

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type NativeRootNavigationProps<
  ScreenName extends keyof AppStackList
> = NativeStackScreenProps<AppStackList, ScreenName> & Title;

/**
 * Add description here
 */
export type NativeNavigationComponent<
  ScreenName extends keyof AppStackList
> = React.FC<NativeRootNavigationProps<ScreenName>> & {
  navTitle: MessageDescriptor;
};

export type NativeHomeTabsNavigationProps<
  ScreenName extends keyof HomeTabsList
> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsList, ScreenName>,
  NativeStackScreenProps<AppStackList>
>;

export type MapServerStyleInfo = Unpacked<ReturnType<StylesApi["listStyles"]>>;

export type MapServerImport = Unpacked<ReturnType<ImportsApi["getImport"]>>;
