// @flow

export type IconSize = "small" | "medium" | "large";
export type ImageSize = "thumbnail" | "preview" | "original";
// Pass through a react-native element to get valid styles e.g. Style<typeof Text>
export type Style<T> = $PropertyType<React.ElementProps<T>, "style">;
