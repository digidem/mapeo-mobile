import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { ListContext } from "./ListContext";

interface Props extends React.PropsWithChildren<ViewProps> {
  dense?: boolean;
}

export const List = ({ children, dense = false, style, ...other }: Props) => {
  const context = React.useMemo(() => ({ dense }), [dense]);
  return (
    <ListContext.Provider value={context}>
      <View style={[styles.root, style]} {...other}>
        {children}
      </View>
    </ListContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    margin: 0,
    paddingVertical: 8,
  },
});
