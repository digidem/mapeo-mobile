import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    minWidth: 56,
    flexShrink: 0,
    justifyContent: "center",
  },
});

/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */
const ListItemIcon = ({ iconName, ...other }) => {
  return (
    <View style={styles.root} {...other}>
      <MaterialIcon name={iconName} size={24} color="rgba(0, 0, 0, 0.54)" />
    </View>
  );
};

ListItemIcon.propTypes = {
  /**
   * The content of the component, normally `Icon`, `SvgIcon`,
   * or a `@material-ui/icons` SVG icon element.
   */
  iconName: PropTypes.string.isRequired,
};

export default ListItemIcon;
