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

const HeaderLeft = ({ onPress }) => (
  <IconButton onPress={onPress}>
    <BackIcon />
  </IconButton>
);

class ManualGpsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    title: "Coordenadas UTM",
    headerLeft: HeaderLeft,
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
      const parsedNorthing = parseNumber(northing);
      let northern;
      // There are two conventions for UTM. One uses a letter to refer to latitude
      // bands from C to X, excluding "I" and "O". The other uses "N" or "S" to
      // refer to the northern or southern hemisphere. If the user enters "N" or
      // "S" we do not know which convention they are using, so we guess. We try
      // to use the latitude band if we can, since it is better for catching
      // errors in coordinate entry.
      if (zoneLetter === "S") {
        // "S" could refer to grid zone "S" (in the northern hemisphere) or it
        // could mean "Southern" - conventions differ in different places
        const startOfZoneS = 3544369.909548157;
        const startOfZoneT = 4432069.057005376;
        if (
          parsedNorthing !== undefined &&
          parsedNorthing >= startOfZoneS &&
          parsedNorthing < startOfZoneT
        ) {
          // Indeterminate, this could be latitude band S, or it could mean
          // southern hemisphere. The only place in the southern hemisphere that
          // matches these coordinates is the very southern tip of Chile and
          // Argentina, so assume that in this case zoneLetter "S" refers to
          // latitude band "S", in the northern hemisphere.
          // TODO: Check with the user what they mean, or use last known location
        } else {
          // The northing is not within the range of grid zone "S", so we assume
          // the user meant "Southern" with the letter "S"
          northern = false;
        }
      } else if (zoneLetter === "N") {
        const startOfZoneN = 0;
        const startOfZoneP = 885503.7592863895;
        if (
          parsedNorthing &&
          parsedNorthing >= startOfZoneN &&
          parsedNorthing < startOfZoneP
        ) {
          // Definitely in latitude band N, just use the band letter
        } else {
          // Outside latitude band "N", so the user probably means "Northern"
          northern = true;
        }
      }
      return toLatLon(
        parseNumber(easting),
        parseNumber(northing),
        parseNumber(zoneNum),
        // If northern defined, then don't use the zoneLetter.
        northern !== undefined ? undefined : zoneLetter,
        northern
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
            <Text style={styles.inputLabel}>Numero de Zona</Text>
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
            <Text style={styles.inputLabel}>Letra de Zona</Text>
            <TextInput
              placeholder="S"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              onChangeText={zoneLetter =>
                this.setState({ zoneLetter: zoneLetter.trim().toUpperCase() })
              }
              maxLength={1}
              autoCapitalize="characters"
              style={styles.input}
              value={this.state.zoneLetter}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Este</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                autoFocus
                placeholder="XXXXXX"
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
                placeholder="XXXXXX"
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
    marginBottom: 20,
    alignItems: "flex-end"
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
