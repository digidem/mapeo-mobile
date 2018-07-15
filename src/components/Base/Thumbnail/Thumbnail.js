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

class Thumbnail extends React.PureComponent<StateProps & Props> {
  render() {
    const { attachment, attachmentId, style } = this.props;

    if (attachment.status === 'Pending' || attachment.status === 'Failed') {
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
        source={{
          uri: getMediaUrl(attachmentId, true)
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
