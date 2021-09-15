import * as React from "react";
import { StyleSheet, TouchableNativeFeedbackProps, View } from "react-native";

import { VERY_LIGHT_BLUE } from "../../lib/styles";
import { ViewStyleProp } from "../../sharedTypes";
import { TouchableNativeFeedback } from "../Touchables";
import { ListContext } from "./ListContext";

interface Props extends React.PropsWithChildren<TouchableNativeFeedbackProps> {
  alignItems?: "flex-start" | "center";
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
  style?: ViewStyleProp;
}

export const ListItem = ({
  alignItems = "center",
  children,
  dense = false,
  disabled = false,
  disableGutters = false,
  divider = false,
  style,
  ...otherProps
}: Props) => {
  const context = React.useContext(ListContext);
  const childContext = React.useMemo(
    () => ({
      dense: dense || context.dense || false,
      alignItems,
    }),
    [dense, context.dense, alignItems]
  );

  const componentStyle = [
    styles.root,
    childContext.dense && styles.dense,
    !disableGutters && styles.gutters,
    divider && styles.divider,
    alignItems === "flex-start" && styles.alignItemsFlexStart,
    style,
  ];

  return (
    <ListContext.Provider value={childContext}>
      <TouchableNativeFeedback
        disabled={disabled}
        {...otherProps}
        background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
      >
        <View style={componentStyle}>{children}</View>
      </TouchableNativeFeedback>
    </ListContext.Provider>
  );
};

const styles = StyleSheet.create({
  /* Styles applied to the (normally root) `component` element. May be wrapped by a `container`. */
  root: {
    flex: 0,
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "relative",
    width: "100%",
    textAlign: "left",
    paddingTop: 8,
    paddingBottom: 8,
  },
  /* Styles applied to the `component` element if `alignItems="flex-start"`. */
  alignItemsFlexStart: {
    alignItems: "flex-start",
  },
  /* Styles applied to the `component` element if dense. */
  dense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  /* Styles applied to the inner `component` element if `divider={true}`. */
  divider: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
  },
  /* Styles applied to the inner `component` element if `disableGutters={false}`. */
  gutters: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
