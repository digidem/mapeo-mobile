// @flow
import React from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import Thumbnail from "./Thumbnail";
import type { Photo } from "../context/DraftObservationContext";
import type { ObservationAttachment } from "../context/ObservationsContext";

const spacing = 10;
const minSize = 150;

type Props = {
  photos: Array<Photo | ObservationAttachment>
};

class ThumbnailScrollView extends React.PureComponent<Props> {
  _scrollView: { current: any };
  constructor(props: Props) {
    super(props);
    this._scrollView = React.createRef();
  }
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.photos.length > prevProps.photos.length &&
      this._scrollView.current
    ) {
      this._scrollView.current.scrollToEnd();
    }
  }
  render() {
    const { photos } = this.props;
    if (photos.length === 0) return null;
    const windowWidth = Dimensions.get("window").width;
    // Get a thumbnail size so there is always 1/2 of a thumbnail off the right of
    // the screen.
    const size =
      windowWidth / (Math.round(0.6 + windowWidth / minSize) - 0.5) - spacing;
    return (
      <ScrollView
        ref={this._scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photosContainer}
      >
        {photos
          // $FlowFixMe
          .filter(photo => !photo.deleted)
          .map((photo, index) => (
            <Thumbnail
              key={index}
              {...photo}
              style={styles.thumbnail}
              size={size}
            />
          ))}
      </ScrollView>
    );
  }
}

export default ThumbnailScrollView;

const styles = StyleSheet.create({
  photosContainer: {
    backgroundColor: "#dddddd",
    flex: 1,
    padding: 5
  },
  thumbnail: {
    margin: 5
  }
});
