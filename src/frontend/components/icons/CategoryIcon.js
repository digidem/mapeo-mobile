// @flow
import React from "react";
import { Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { getIconUrl } from "../../api";
import type { IconSize } from "../../types";

type Props = {
  size: IconSize,
  iconId?: string
};

type State = {
  error: boolean
};

class CategoryIcon extends React.PureComponent<Props, State> {
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

export default CategoryIcon;
