// @flow
import React from "react";
import {
  View,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView
} from "react-native";
import Image from "react-native-remote-svg";
import type { NavigationScreenProp } from "react-navigation";
import CancelModal from "../../Base/CancelModal/CancelModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import CheckIcon from "react-native-vector-icons/Octicons";
import CloseIcon from "react-native-vector-icons/MaterialCommunityIcons";
import LocationPin from "react-native-vector-icons/Entypo";
import I18n from "react-native-i18n";

import FormattedCoords from "./FormattedCoords";
import ObservationIcon from "./ObservationIcon";
import LocationIcon from "./icons/LocationIcon";
import Circle from "./Circle";
import type { Category } from "../../../types/category";
import type { Observation, UpdateRequest } from "../../../types/observation";
import type { GPSState } from "../../../types/gps";
import PencilIcon from "../../../images/editor-details.png";
import {
  DARK_MANGO,
  LIGHT_GREY,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_BLUE
} from "../../../lib/styles";
import Header from "../../Base/Header";
import ManualGPSModal from "../../Base/ManualGPSModal";
import getGPSText from "../../../lib/getGPSText";
import { HIGH_ACCURACY } from "../../../ducks/gps";
import Thumbnail from "../../Base/Thumbnail";
import { getSvgUri } from "../../../lib/media";

export type StateProps = {
  category?: Category,
  selectedObservation?: Observation,
  observationSource: string,
  cancelModalVisible: boolean,
  gps: GPSState,
  manualGPSModalVisible: boolean,
  gpsFormat: string,
  icons: Object
};

export type Props = {
  navigation: NavigationScreenProp<*>
};

export type DispatchProps = {
  updateObservation: (o: UpdateRequest) => void,
  showCancelModal: () => void,
  hideCancelModal: () => void,
  clearSelectedObservation: () => void,
  hideManualGPSModal: () => void,
  showManualGPSModal: () => void,
  saveObservation: (update: boolean) => void
};

type State = {
  goToCamera: boolean,
  keyboardShown: boolean,
  text: string,
  keyboardHeight: number,
  numExistingPhotos: number,
  existingNotes: string,
  numExistingFieldsAnswered: number
};

const styles = StyleSheet.create({
  headerSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: VERY_LIGHT_BLUE
  },
  bottomButton: {
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  bottomButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "black"
  },
  categoryPositionText: {
    fontSize: 12,
    color: "black",
    fontWeight: "700",
    marginLeft: 3
  },
  check: {
    backgroundColor: MANGO,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  checkOuterCircle: {
    width: 30,
    height: 30,
    backgroundColor: DARK_MANGO,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  checkIcon: {
    alignSelf: "center",
    marginLeft: 3
  },
  circle: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 1,
    margin: 5
  },
  collectionsImg: {
    alignSelf: "center"
  },
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  mediaRow: {
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    height: 85
  },
  mediaRowKeyboardShown: {
    flex: 1,
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    marginBottom: -100
  },
  photosButton: {
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    padding: 20,
    paddingBottom: 30,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top",
    backgroundColor: "white",
    borderColor: LIGHT_GREY
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center"
  },
  titleLong: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",
    textAlign: "center"
  },
  triangle: {
    alignSelf: "center",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(0, 0, 0, .8)",
    transform: [{ rotate: "180deg" }]
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require("../../../translations/en"),
  es: require("../../../translations/es")
};

class ObservationEditor extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  paddingInput: Animated.Value;
  scrollView: any;
  textInput: any;
  subscriptions: Array<any>;

  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.paddingInput = new Animated.Value(0);

    const { selectedObservation } = props;
    let numExistingPhotos = 0;
    let existingNotes = "";
    let numExistingFieldsAnswered = 0;
    if (selectedObservation) {
      numExistingPhotos = selectedObservation.attachments.length;
      existingNotes = selectedObservation.notes;
      numExistingFieldsAnswered = selectedObservation.fields.filter(
        field => field.answered
      ).length;
    }

    this.state = {
      keyboardShown: false,
      text: props.selectedObservation ? props.selectedObservation.notes : "",
      goToCamera: false,
      keyboardHeight: 0,
      numExistingPhotos,
      existingNotes,
      numExistingFieldsAnswered
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const {
      updateObservation,
      selectedObservation,
      category,
      hideManualGPSModal,
      navigation
    } = this.props;

    if (hideManualGPSModal) {
      hideManualGPSModal();
    }

    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
        categoryId: category.id
      });
    }
    this.subscriptions = [
      Keyboard.addListener("keyboardWillShow", this.keyboardWillShow),
      Keyboard.addListener("keyboardWillHide", this.keyboardWillHide),
      Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
      Keyboard.addListener("keyboardDidHide", this.keyboardDidHide),
      navigation.addListener("willFocus", this.onFocus)
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.remove());
  }

  keyboardWillShow = (e: any) => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 60
    }).start();
  };

  keyboardWillHide = (e: any) => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 0
    }).start();
  };

  keyboardDidShow = (e: any) => {
    this.setState(previousState => ({
      goToCamera: false,
      keyboardShown: true,
      text: previousState.text,
      keyboardHeight: e.endCoordinates.height
    }));
  };

  keyboardDidHide = () => {
    if (this.state.goToCamera) {
      this.setState(previousState => ({
        goToCamera: false,
        keyboardShown: false,
        text: previousState.text
      }));
      this.props.navigation.navigate({
        routeName: "CameraView",
        params: { showEditorView: true }
      });
    } else {
      this.setState(previousState => ({
        goToCamera: previousState.goToCamera,
        keyboardShown: false,
        text: previousState.text
      }));
    }
  };

  handleTextInputChange = (text: string) => {
    this.setState({ text });
  };

  handleTextInputBlur = () => {
    const { selectedObservation, updateObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
        notes: this.state.text
      });
    }
  };

  goToCameraView = () => {
    const { selectedObservation, updateObservation, navigation } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
        notes: this.state.text
      });
    }
    if (this.state.keyboardShown) {
      this.setState(previousState => ({
        goToCamera: true,
        keyboardShown: false,
        text: previousState.text
      }));
    } else {
      navigation.navigate({
        routeName: "CameraView",
        params: { showEditorView: true },
        key: "camera-view"
      });
    }
    Keyboard.dismiss();
  };

  render() {
    const { draft, preset, navigate } = this.props;
    const { keyboardShown, text } = this.state;
    const keyExtractor = (item, i) => i.toString();

    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigate("CategoryChooser")}>
            <Circle>
              <ObservationIcon iconId={preset.icon} size="medium" />
            </Circle>
          </TouchableOpacity>
          <View style={{ marginTop: 5, flexDirection: "row" }}>
            <LocationIcon size={20} />
            <FormattedCoords
              lon={draft.lon}
              lat={draft.lat}
              style={styles.categoryPositionText}
            />
          </View>
        </View>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          contentContainerStyle={{ flex: 1 }}
        >
          <TextInput
            ref={ref => (this.textInput = ref)}
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            onFocus={() => this.scrollView.scrollToEnd()}
            placeholder={I18n.t("editor.placeholder")}
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onBlur={this.handleTextInputBlur}
            multiline
            autoFocus
          />
        </ScrollView>
        {!!selectedObservation && !!selectedObservation.attachments.length && (
          <View
            style={
              keyboardShown ? styles.mediaRowKeyboardShown : styles.mediaRow
            }
          >
            <FlatList
              horizontal
              scrollEnabled
              style={{
                flex: 1,
                flexDirection: "row",
                paddingTop: 10
              }}
              contentContainerStyle={{
                alignContent: "flex-start"
              }}
              keyExtractor={keyExtractor}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (this.allowEditing(index)) {
                      navigation.navigate({
                        routeName: "PhotoView",
                        params: { photoId: item }
                      });
                    } else {
                      navigation.navigate({
                        routeName: "PhotoView",
                        params: {
                          fromDetailView: true,
                          photoId: item
                        }
                      });
                    }
                  }}
                  style={{ paddingLeft: 10 }}
                >
                  <Thumbnail attachmentId={item} />
                </TouchableOpacity>
              )}
              data={selectedObservation.attachments}
            />
          </View>
        )}
        <View
          style={{
            borderTopWidth: 1,
            borderColor: LIGHT_GREY
          }}
        >
          {keyboardShown && (
            <Animated.View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                backgroundColor: "white",
                marginBottom: this.state.keyboardHeight,
                height: 55
              }}
            >
              <TouchableOpacity
                onPress={this.goToCameraView}
                underlayColor="transparent"
                style={{ flex: 1, alignItems: "center" }}
              >
                <Icon color={MEDIUM_GREY} name="photo-camera" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.goToObservationFields}
                underlayColor="transparent"
                style={{ flex: 1, alignItems: "center" }}
              >
                <Image source={PencilIcon} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
            </Animated.View>
          )}
          {!keyboardShown && (
            <View>
              <TouchableOpacity
                style={styles.photosButton}
                onPress={this.goToCameraView}
                underlayColor="transparent"
              >
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    color={MEDIUM_GREY}
                    name="photo-camera"
                    size={30}
                    style={{ marginHorizontal: 30 }}
                  />
                  <Text style={styles.bottomButtonText}>
                    {I18n.t("editor.media_button")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={this.goToObservationFields}
                underlayColor="transparent"
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={PencilIcon}
                    style={{
                      marginLeft: 34,
                      marginRight: 31,
                      width: 25,
                      height: 25
                    }}
                  />
                  <Text style={styles.bottomButtonText}>
                    {I18n.t("editor.details_button")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <CancelModal
          onContinue={this.handleModalContinue}
          onCancel={this.handleModalCancel}
          visible={cancelModalVisible}
        />
        <ManualGPSModal
          goToManualEnter={goToManualEnter}
          onWaiting={this.handleWaiting}
          onSave={this.handleSave}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default ObservationEditor;
