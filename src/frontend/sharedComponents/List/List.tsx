import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { ViewStyleProp } from "../../sharedTypes";
import Text from "../Text";
import { ListContext } from "./ListContext";

interface Props extends React.PropsWithChildren<ViewProps> {
  dense?: boolean;
  disablePadding?: boolean;
  style?: ViewStyleProp;
  subheader?: React.ReactNode;
}

export const List = ({
  children,
  dense = false,
  disablePadding = false,
  style,
  subheader,
  ...other
}: Props) => {
  const context = React.useMemo(() => ({ dense }), [dense]);
  return (
    <ListContext.Provider value={context}>
      <View
        style={[styles.root, !disablePadding && styles.padding, style]}
        {...other}
      >
        {subheader && <Text style={styles.subheader}>{subheader}</Text>}
        {children}
      </View>
    </ListContext.Provider>
  );
};

const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
  },
  /* Styles applied to the root element if `disablePadding={false}`. */
  padding: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  /* Styles applied to the root element if a `subheader` is provided. */
  subheader: {
    paddingTop: 0,
  },
});
