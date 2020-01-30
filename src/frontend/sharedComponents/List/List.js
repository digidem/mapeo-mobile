import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";

const List = ({
  children,
  style,
  disablePadding = false,
  subheader,
  ...other
}) => (
  <View
    style={[styles.root, !disablePadding && styles.padding, style]}
    {...other}>
    {subheader && <Text style={styles.subheader}>{subheader}</Text>}
    {children}
  </View>
);

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
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, vertical padding will be removed from the list.
   */
  disablePadding: PropTypes.bool,
  /**
   * The content of the subheader, normally `ListSubheader`.
   */
  subheader: PropTypes.node
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
    padding: 0
  },
  /* Styles applied to the root element if `disablePadding={false}`. */
  padding: {
    paddingTop: 8,
    paddingBottom: 8
  },
  /* Styles applied to the root element if a `subheader` is provided. */
  subheader: {
    paddingTop: 0
  }
});
