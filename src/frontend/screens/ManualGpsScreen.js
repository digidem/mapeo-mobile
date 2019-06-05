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
    title: "Coordenadas UTM",
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
      zoneNum: zoneNum ? zoneNum + "" : "",
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
      return toLatLon(
        parseNumber(easting),
        parseNumber(northing),
        parseNumber(zoneNum),
        zoneLetter
      );
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
        metadata: {
          ...draft.value.metadata,
          manualLocation: true
        },
        tags: draft.value.tags
      });
      // $FlowFixMe
      navigation.pop();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Este</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="DDDDDD"
                placeholderTextColor="silver"
                underlineColorAndroid="transparent"
                keyboardType="number-pad"
                onChangeText={easting => this.setState({ easting })}
                style={styles.input}
                value={this.state.easting}
              />
              <Text style={styles.suffix}>mE</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Norte</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="DDDDDDD"
                placeholderTextColor="silver"
                underlineColorAndroid="transparent"
                keyboardType="number-pad"
                onChangeText={northing => this.setState({ northing })}
                style={styles.input}
                value={this.state.northing}
              />
              <Text style={styles.suffix}>mN</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Numero de Zona UTM</Text>
            <TextInput
              placeholder="DD"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              keyboardType="number-pad"
              onChangeText={zoneNum => this.setState({ zoneNum })}
              maxLength={2}
              value={this.state.zoneNum}
              style={styles.input}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Letra de Zona UTM</Text>
            <TextInput
              placeholder="S"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              onChangeText={zoneLetter =>
                this.setState({ zoneLetter: zoneLetter.trim() })
              }
              maxLength={1}
              autoCapitalize="characters"
              style={styles.input}
              value={this.state.zoneLetter}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default withDraft()(withLocation(ManualGpsScreen));

function parseNumber(str: string): number | void {
  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) throw new Error("Coordenada no válido");
  return Number.isNaN(num) ? undefined : num;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10
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
    marginBottom: 10
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    width: "50%"
  },
  suffix: {
    fontSize: 20,
    marginLeft: 5,
    paddingTop: 5
  }
});
