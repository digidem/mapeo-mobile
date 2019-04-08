// @flow
import React from "react";
import { View, ActivityIndicator, Image } from "react-native";

import { getMediaUrl } from "../api";
import { LIGHT_GREY, RED } from "../../../lib/styles";
import AlertIcon from "./icons/AlertIcon";

type Props = {
  attachmentId: string,
  style?: any
};

type State = {
  error: boolean
};

class Thumbnail extends React.PureComponent<Props, State> {
  state = { error: false };

  handleImageError = () => {
    this.setState({ error: true });
  };

  render() {
    const { attachmentId, style } = this.props;
    const { error } = this.state;

    if (
      attachment &&
      (attachment.status === "Pending" ||
        attachment.status === "Failed" ||
        !attachment.data)
    ) {
      return (
        <View
          style={[
            {
              width: 65,
              height: 65,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: LIGHT_GREY,
              marginHorizontal: 5
            },
            style
          ]}
        >
          {attachment.status === "Pending" && <ActivityIndicator />}
          {attachment.status === "Failed" && (
            <Icons color={RED} name="alert" size={30} />
          )}
        </View>
      );
    }

    return (
      <Image
        onError={this.handleImageError}
        source={{
          uri: getMediaUrl(attachmentId)
        }}
        style={[
          {
            width: 65,
            height: 65,
            borderRadius: 5,
            marginHorizontal: 5
          },
          style
        ]}
      />
    );
  }
}

export default Thumbnail;
