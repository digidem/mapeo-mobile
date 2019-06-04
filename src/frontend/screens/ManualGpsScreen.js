// @flow
import React from "react";
import { toLatLon, fromLatLon } from "utm";
import { View, Text, TextInput, StyleSheet, ToastAndroid } from "react-native";
import { BLACK, LIGHT_GREY } from "../lib/styles";
import type { NavigationScreenConfigProps } from "react-navigation";

import { withDraft } from "../context/DraftObservationContext";
import type { DraftObservationContext } from "../context/DraftObservationContext";
import { withLocation } from "../context/LocationContext";
import type { LocationContextType } from "../context/LocationContext";

import IconButton from "../sharedComponents/IconButton";
import { BackIcon, SaveIcon } from "../sharedComponents/icons";

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  draft: DraftObservationContext,
  location: LocationContextType
};

type State = {
  zoneNum: string,
  zoneLetter: string,
  easting: string,
  northing: string
};

const HeaderLeft = ({ navigation }) => (
  <IconButton onPress={() => navigation.pop()}>
    <BackIcon />
  </IconButton>
);

class ManualGpsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    title: "Manual GPS",
    headerLeft: React.memo(HeaderLeft),
    headerRight: (
      <IconButton onPress={navigation.getParam("handleSavePress")}>
        <SaveIcon inprogress={false} />
      </IconButton>
    )
  });

  constructor(props) {
    super(props);
    let zoneNum;
    let zoneLetter;
    const { location } = this.props;
    if (location.savedPosition) {
      const { latitude, longitude } = location.savedPosition.coords;
      try {
        ({ zoneNum, zoneLetter } = fromLatLon(latitude, longitude));
      } catch (e) {}
    }
    this.state = {
      zoneNum: zoneNum || "",
      zoneLetter: zoneLetter || "",
      easting: "",
      northing: ""
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSavePress: this.onSave });
  }

  toLatLon() {
    const { zoneNum, zoneLetter, easting, northing } = this.state;
    try {
      return toLatLon(easting, northing, zoneNum, zoneLetter);
    } catch (err) {
      ToastAndroid.showWithGravity(
        err.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP
      );
      return false;
    }
  }

  onSave = () => {
    const locationData = this.toLatLon();
    if (locationData) {
      const { draft, navigation } = this.props;
      draft.setValue({
        lat: locationData.latitude,
        lon: locationData.longitude,
        locationSetManually: true,
        tags: { ...draft.value.tags }
      });
      // $FlowFixMe
      navigation.pop();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>UTM Coordinates</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}> Zone Number</Text>
            <TextInput
              placeholder="DD"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              onChangeText={zoneNum => this.setState({ zoneNum })}
              value={this.state.zoneNum}
              style={styles.input}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Zone Letter</Text>
            <TextInput
              placeholder="S"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              onChangeText={zoneLetter =>
                this.setState({ zoneLetter: zoneLetter.trim() })
              }
              style={styles.input}
              value={this.state.zoneLetter}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Easting</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="DDDDDD"
                placeholderTextColor="silver"
                underlineColorAndroid="transparent"
                keyboardType="numeric"
                onChangeText={easting => this.setState({ easting })}
                style={styles.input}
                value={this.state.easting}
              />
              <Text style={styles.suffix}>m E</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Northing</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="DDDDDDD"
                placeholderTextColor="silver"
                underlineColorAndroid="transparent"
                keyboardType="numeric"
                onChangeText={northing => this.setState({ northing })}
                style={styles.input}
                value={this.state.northing}
              />
              <Text style={styles.suffix}>m N</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withDraft()(withLocation(ManualGpsScreen));

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: BLACK
  },
  inputLabel: {
    fontWeight: "bold",
    color: BLACK
  },
  input: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    marginTop: 10
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10
  },
  column: {
    marginRight: 20
  },
  suffix: {
    fontSize: 20,
    marginLeft: 5,
    paddingTop: 5
  }
});
