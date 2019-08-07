// @flow
import * as React from "react";

export type IconSize = "small" | "medium" | "large";
export type ImageSize = "thumbnail" | "preview" | "original";
// Pass through a react-native element to get valid styles e.g. Style<typeof Text>
export type Style<T> = $PropertyType<React.ElementProps<T>, "style">;
export type MapStyle = {
  id: string,
  name: string,
  bounds: number[],
  minzoom: number,
  maxzoom: number
};
export type UseState<S> = [S, ((S => S) | S) => void];
