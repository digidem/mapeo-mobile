// @flow
import * as React from "react";
import { Keyboard, View, StyleSheet } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, FormattedMessage } from "react-intl";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";

const m = defineMessages({
  addLabel: {
    id: "screens.ObservationEdit.BottomSheet.addLabel",
    defaultMessage: "Add…",
    description:
      "Label above keyboard that expands into bottom sheet of options to add (photo, details etc)",
  },
});

type Props = {
  items: Array<{|
    icon: React.Node,
    label: string,
    onPress: () => any,
  |}>,
};

type State = {
  keyboardVisible: boolean,
};

const ItemButton = ({ onPress, icon, label }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.itemContainer}>
      <View style={styles.itemIcon}>{icon}</View>
      <Text numberOfLines={1} style={styles.itemLabel}>
        {label}
      </Text>
    </View>
  </TouchableNativeFeedback>
);

const KeyboardAccessory = ({ onPress, icons }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.accessoryContainer}>
      <Text numberOfLines={1} style={styles.accessoryLabel}>
        <FormattedMessage {...m.addLabel} />
      </Text>
      <View style={styles.accessoryIconContainer}>
        {icons.map((icon, idx) => (
          <View key={idx} style={styles.accessoryIcon}>
            {icon}
          </View>
        ))}
      </View>
    </View>
  </TouchableNativeFeedback>
);

class BottomSheet extends React.Component<Props, State> {
  _subs: Array<any> = [];
  state = {
    keyboardVisible: false,
  };

  componentDidMount() {
    this._subs.push(
      Keyboard.addListener("keyboardDidHide", () =>
        this.setState({ keyboardVisible: false })
      )
    );
    this._subs.push(
      Keyboard.addListener("keyboardDidShow", () =>
        this.setState({ keyboardVisible: true })
      )
    );
  }

  componentWillUnmount() {
    this._subs.forEach(s => s.remove());
  }

  render() {
    const { items } = this.props;
    const { keyboardVisible } = this.state;
    return (
      <View style={[styles.container]}>
        {keyboardVisible ? (
          <KeyboardAccessory
            icons={items.map(i => i.icon)}
            onPress={() => Keyboard.dismiss()}
          />
        ) : (
          <>
            {items.map(item => (
              <ItemButton key={item.label} {...item} />
            ))}
          </>
        )}
      </View>
    );
  }
}

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: "flex-end",
    width: "100%",
    flexDirection: "column",
    alignContent: "flex-end",
  },
  itemContainer: {
    flex: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  itemIcon: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  itemLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
  accessoryContainer: {
    flex: 0,
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  accessoryIconContainer: {
    flexDirection: "row",
  },
  accessoryIcon: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },
  accessoryLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
});
