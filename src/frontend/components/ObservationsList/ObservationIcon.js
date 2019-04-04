// @flow
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { getIconUrl } from "../../api";
import type { IconSize } from "../../types/other";

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  }
});

type Props = {
  size: IconSize,
  iconId?: string
};

type State = {
  error: boolean
};

class ObservationIcon extends React.PureComponent<Props, State> {
  static defaultProps = {
    size: "medium"
  };

  state = {
    error: false
  };

  handleError = () => {
    this.setState({ error: true });
  };

  render() {
    const { size, iconId } = this.props;
    // Fallback to a default icon if we can't load the icon from mapeo-server
    return (
      <View style={styles.circle}>
        {this.state.error || !iconId ? (
          <MaterialIcon name="place" size={35} />
        ) : (
          <Image
            style={{ width: 35, height: 35 }}
            source={{ uri: getIconUrl(iconId, size) }}
            onError={this.handleError}
          />
        )}
      </View>
    );
  }
}

export default ObservationIcon;
