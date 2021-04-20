import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../Text";
import PropTypes from "prop-types";
import ListContext from "./ListContext";

const List = ({
  children,
  style,
  disablePadding = false,
  subheader,
  dense = false,
  ...other
}) => {
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

List.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  styles: PropTypes.object,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input will be used for
   * the list and list items.
   * The prop is available to descendant components as the `dense` context.
   */
  dense: PropTypes.bool,
  /**
   * If `true`, vertical padding will be removed from the list.
   */
  disablePadding: PropTypes.bool,
  /**
   * The content of the subheader, normally `ListSubheader`.
   */
  subheader: PropTypes.node,
};

export default List;

export const styles = StyleSheet.create({
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
