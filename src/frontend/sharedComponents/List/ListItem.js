import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";
import ListContext from "./ListContext";

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
    paddingBottom: 8
  },
  /* Styles applied to the `component` element if `alignItems="flex-start"`. */
  alignItemsFlexStart: {
    alignItems: "flex-start"
  },
  /* Styles applied to the `component` element if dense. */
  dense: {
    paddingTop: 4,
    paddingBottom: 4
  },
  /* Styles applied to the inner `component` element if `divider={true}`. */
  divider: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: "rgba(0, 0, 0, 0.12)"
  },
  /* Styles applied to the inner `component` element if `disableGutters={false}`. */
  gutters: {
    paddingLeft: 16,
    paddingRight: 16
  }
});

const ListItem = ({
  alignItems = "center",
  button = false,
  children,
  style,
  dense = false,
  disabled = false,
  disableGutters = false,
  divider = false,
  ...other
}) => {
  const context = React.useContext(ListContext);
  const childContext = React.useMemo(
    () => ({
      dense: dense || context.dense || false,
      alignItems
    }),
    [dense, context.dense, alignItems]
  );

  const componentProps = {
    style: [
      styles.root,
      childContext.dense && styles.dense,
      !disableGutters && styles.gutters,
      divider && styles.divider,
      button && styles.button,
      alignItems === "flex-start" && styles.alignItemsFlexStart,
      style
    ],
    disabled,
    ...other
  };

  return (
    <ListContext.Provider value={childContext}>
      <TouchableNativeFeedback
        {...componentProps}
        background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
        {children}
      </TouchableNativeFeedback>
    </ListContext.Provider>
  );
};

ListItem.propTypes = {
  /**
   * Defines the `align-items` style property.
   */
  alignItems: PropTypes.oneOf(["flex-start", "center"]),
  /**
   * If `true`, the list item will be focused during the first mount.
   * Focus will also be triggered if the value changes from false to true.
   */
  autoFocus: PropTypes.bool,
  /**
   * If `true`, the list item will be a button (using `ButtonBase`). Props intended
   * for `ButtonBase` can then be applied to `ListItem`.
   */
  button: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  styles: PropTypes.object,
  /**
   * If `true`, the list item will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the left and right padding is removed.
   */
  disableGutters: PropTypes.bool,
  /**
   * If `true`, a 1px light border is added to the bottom of the list item.
   */
  divider: PropTypes.bool
};

export default ListItem;
