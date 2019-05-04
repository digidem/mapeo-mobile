// @flow
import * as React from "react";
import { Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import Circle from "./Circle";
import { getIconUrl } from "../../api";
import type { IconSize } from "../../types";

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
