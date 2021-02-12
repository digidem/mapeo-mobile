import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../Text";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  /* Styles applied to the `Typography` components if primary and secondary are set. */
  multiline: {
    marginTop: 6,
    marginBottom: 6,
  },
  /* Styles applied to the root element if `inset={true}`. */
  inset: {
    paddingLeft: 56,
  },
  primary: {
    fontSize: 16,
    lineHeight: 1.5 * 16,
    color: "rgba(0, 0, 0, 0.87)",
  },
  secondary: {
    fontSize: 14,
    lineHeight: 1.43 * 14,
    color: "rgba(0, 0, 0, 0.54)",
  },
});

const ListItemText = ({
  style,
  inset = false,
  primary,
  secondary,
  ...other
}) => {
  return (
    <View
      style={[
        styles.root,
        inset && styles.inset,
        primary && secondary ? styles.multiline : undefined,
      ]}
      {...other}
    >
      <Text style={styles.primary}>{primary}</Text>
      {secondary && <Text style={styles.secondary}>{secondary}</Text>}
    </View>
  );
};

ListItemText.propTypes = {
  /**
   * If `true`, the children will be indented.
   * This should be used if there is no left avatar or left icon.
   */
  inset: PropTypes.bool,
  /**
   * The main content element.
   */
  primary: PropTypes.node,
  /**
   * The secondary content element.
   */
  secondary: PropTypes.node,
};

export default ListItemText;
