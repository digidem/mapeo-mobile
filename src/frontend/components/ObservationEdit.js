// @flow
import React from "react";
import { Dimensions, ScrollView, View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

import LocationField from "./LocationField";
import FormattedCoords from "./FormattedCoords";
import ObservationIcon from "./ObservationIcon";
import CameraIcon from "./icons/CameraIcon";
import Thumbnail from "./Thumbnail";
import Circle from "./Circle";
import { VERY_LIGHT_BLUE } from "../lib/styles";
import { withDraft } from "../context/DraftObservationContext";

import type { Preset } from "../context/PresetsContext";
import type { Photo } from "../context/DraftObservationContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "stretch"
  },
  locationContainer: {
    flex: 0,
    backgroundColor: "#dddddd",
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  accuracy: {
    fontWeight: "bold"
  },
  categoryContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "stretch",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  categoryIcon: {
    flex: 0
  },
  categoryName: {
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1
  },
  categoryButton: {
    flex: 0,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryButtonText: {
    color: "blue"
  },
  descriptionContainer: {
    minHeight: 200,
    flex: 1
  },
  photosContainer: {
    backgroundColor: "#dddddd",
    flex: 1,
    padding: 5
  },
  thumbnail: {
    margin: 5
  },
  addPhotoButton: {
    flex: 0,
    alignSelf: "flex-end",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#dddddd"
  },
  addPhotoIcon: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  addPhotoLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20
  }
});

const LocationView = ({ longitude, latitude, accuracy }) => (
  <View style={styles.locationContainer}>
    {longitude === undefined ||
    latitude === undefined ||
    accuracy === undefined ? (
      <Text>Searching...</Text>
    ) : (
      <>
        <FormattedCoords lat={latitude} lon={longitude} />
        <Text style={styles.accuracy}>{"±" + accuracy.toFixed(2) + "m"}</Text>
      </>
    )}
  </View>
);

const CategoryView = ({
  preset = {},
  onPress
}: {
  preset: Preset,
  onPress: () => void
}) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryIcon}>
      <Circle>
        <ObservationIcon iconId={preset.icon} />
      </Circle>
    </View>
    <Text style={styles.categoryName}>{preset.name || "Observation"}</Text>
    <TouchableNativeFeedback
      style={styles.categoryButton}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
      onPress={onPress}
    >
      <Text style={styles.categoryButtonText}>Change</Text>
    </TouchableNativeFeedback>
  </View>
);

const spacing = 10;
const minSize = 150;

class PhotosView extends React.PureComponent<{ photos: Photo[] }> {
  _scrollView: { current: any };
  constructor(props) {
    super(props);
    this._scrollView = React.createRef();
  }
  componentDidUpdate(prevProps) {
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

const WrappedPhotosView = withDraft(["photos"])(PhotosView);

const AddPhotoButton = ({ onPress }) => (
  <TouchableNativeFeedback onPress={onPress} style={styles.addPhotoButton}>
    <View style={styles.addPhotoIcon}>
      <CameraIcon />
    </View>
    <Text style={styles.addPhotoLabel}>Add Photo</Text>
  </TouchableNativeFeedback>
);

type Props = {
  onPressCategory: () => void,
  onPressCamera: () => void,
  isNew: boolean,
  preset: Preset
};

const ObservationEdit = ({
  isNew,
  preset,
  onPressCategory,
  onPressCamera
}: Props) => (
  <View style={styles.container}>
    <ScrollView style={{ flex: 1 }}>
      <LocationField locked={!isNew}>
        {fieldProps => <LocationView {...fieldProps} />}
      </LocationField>
      <CategoryView preset={preset} onPress={onPressCategory} />
      <View style={styles.descriptionContainer} />
      <WrappedPhotosView />
    </ScrollView>
    <AddPhotoButton onPress={onPressCamera} />
  </View>
);

export default React.memo<Props>(ObservationEdit);
