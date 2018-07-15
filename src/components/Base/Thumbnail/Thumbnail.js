// @flow
import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { getMediaUrl } from '../../../lib/media';
import type { Resource } from '../../../types/redux';
import type { Attachment } from '../../../types/observation';
import { LIGHT_GREY } from '../../../lib/styles';

export type StateProps = {
  attachment: Resource<Attachment>
};

export type Props = {
  attachmentId: string
};

class Thumbnail extends React.PureComponent<StateProps & Props> {
  render() {
    const { attachment, attachmentId } = this.props;

    if (attachment.status === 'Pending') {
      return (
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: LIGHT_GREY,
            marginHorizontal: 5
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Image
        source={{
          uri: getMediaUrl(attachmentId, true)
        }}
        style={{
          width: 65,
          height: 65,
          borderRadius: 5,
          marginHorizontal: 5
        }}
      />
    );
  }
}

export default Thumbnail;
