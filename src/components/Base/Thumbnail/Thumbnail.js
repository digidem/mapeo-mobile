// @flow
import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { getMediaUrl } from '../../../lib/media';
import type { Resource } from '../../../types/redux';
import type { Attachment } from '../../../types/observation';
import { LIGHT_GREY, RED } from '../../../lib/styles';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export type StateProps = {
  attachment: Resource<Attachment>
};

export type Props = {
  attachmentId: string,
  style?: any
};

type State = {
  error: boolean
};

class Thumbnail extends React.PureComponent<StateProps & Props, State> {
  constructor() {
    super();

    this.state = { error: false };
  }

  handleImageError = () => {
    this.setState({ error: true });
  };

  render() {
    const { attachment, attachmentId, style } = this.props;
    const { error } = this.state;

    if (!attachment) {
      return null;
    }

    if (
      attachment.status === 'Pending' ||
      attachment.status === 'Failed' ||
      !attachment.data
    ) {
      return (
        <View
          style={[
            {
              width: 65,
              height: 65,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: LIGHT_GREY,
              marginHorizontal: 5
            },
            style
          ]}
        >
          {attachment.status === 'Pending' && <ActivityIndicator />}
          {attachment.status === 'Failed' && (
            <Icons color={RED} name="alert" size={30} />
          )}
        </View>
      );
    }

    return (
      <Image
        onError={this.handleImageError}
        source={{
          uri: error
            ? attachment.data.thumbnailFallback ||
              attachment.data.originalFallback
            : getMediaUrl(attachmentId, true)
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
