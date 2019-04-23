// @flow
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { getIconUrl } from "../../api";
import type { IconSize } from "../../types";

type CircleProps = {
  radius?: number,
  children: React.Node
};

const Circle = ({ radius = 25, children }: CircleProps) => (
  <View
    style={[
      styles.circle,
      {
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius * 2
      }
    ]}
  >
    {children}
  </View>
);

type IconProps = {
  size?: IconSize,
  iconId?: string
};

type State = {
  error: boolean
};

export class CategoryIcon extends React.PureComponent<IconProps, State> {
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
    if (this.state.error || !iconId) {
      return <MaterialIcon name="place" size={35} />;
    }
    return (
      <Image
        style={{ width: 35, height: 35 }}
        source={{ uri: getIconUrl(iconId, size) }}
        onError={this.handleError}
      />
    );
  }
}

export const CategoryCircleIcon = ({
  radius,
  ...props
}: IconProps & { radius?: number }) => (
  <Circle radius={radius}>
    <CategoryIcon {...props} />
  </Circle>
);

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
