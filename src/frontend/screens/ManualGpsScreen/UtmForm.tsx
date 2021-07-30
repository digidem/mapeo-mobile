import * as React from "react";
import { toLatLon as origToLatLon, fromLatLon } from "utm";
import { View, TextInput, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Text from "../../sharedComponents/Text";
import { BLACK, LIGHT_GREY } from "../../lib/styles";
import { FormProps, parseNumber } from "./shared";

const m = defineMessages({
  zoneNumber: {
    id: "screens.ManualGpsScreen.zoneNumber",
    defaultMessage: "Zone Number",
  },
  zoneLetter: {
    id: "screens.ManualGpsScreen.zoneLetter",
    defaultMessage: "Zone Letter",
  },
  easting: {
    id: "screens.ManualGpsScreen.easting",
    defaultMessage: "East",
  },
  eastingSuffix: {
    id: "screens.ManualGpsScreen.eastingSuffix",
    defaultMessage: "mE",
  },
  northing: {
    id: "screens.ManualGpsScreen.northing",
    defaultMessage: "North",
  },
  northingSuffix: {
    id: "screens.ManualGpsScreen.northingSuffix",
    defaultMessage: "mN",
  },
});

const UtmForm = ({ coords, onValueUpdate }: FormProps) => {
  const { formatMessage: t } = useIntl();

  const [zoneNum, setZoneNum] = React.useState(() => {
    if (typeof coords?.lat === "number" && typeof coords?.lon === "number") {
      try {
        const { zoneNum } = fromLatLon(coords.lat, coords.lon);
        return zoneNum + "";
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  });

  const [zoneLetter, setZoneLetter] = React.useState<string>(() => {
    if (typeof coords?.lat === "number" && typeof coords?.lon === "number") {
      try {
        const { zoneLetter } = fromLatLon(coords.lat, coords.lon);
        return zoneLetter;
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  });

  const [easting, setEasting] = React.useState(() => {
    if (typeof coords?.lat === "number" && typeof coords?.lon === "number") {
      try {
        const { easting } = fromLatLon(coords.lat, coords.lon);
        return easting.toString();
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  });
  const [northing, setNorthing] = React.useState(() => {
    if (typeof coords?.lat === "number" && typeof coords?.lon === "number") {
      try {
        const { northing } = fromLatLon(coords.lat, coords.lon);
        return northing.toString();
      } catch (e) {
        return "";
      }
    } else {
      return "";
    }
  });

  React.useEffect(() => {
    try {
      const { latitude, longitude } = toLatLon({
        easting,
        northing,
        zoneLetter,
        zoneNum,
      });

      onValueUpdate({
        coords: {
          lat: latitude,
          lon: longitude,
        },
      });
    } catch (err) {
      onValueUpdate({
        error: err,
      });
    }
  }, [easting, northing, zoneLetter, zoneNum, onValueUpdate]);

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.zoneNumber} />
          </Text>
          <TextInput
            accessibilityLabel={t(m.zoneNumber)}
            placeholder="DD"
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            keyboardType="number-pad"
            onChangeText={setZoneNum}
            maxLength={2}
            value={zoneNum}
            style={styles.input}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.zoneLetter} />
          </Text>
          <TextInput
            accessibilityLabel={t(m.zoneLetter)}
            placeholder="S"
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onChangeText={zoneLetter =>
              setZoneLetter(zoneLetter.trim().toUpperCase())
            }
            maxLength={1}
            autoCapitalize="characters"
            style={styles.input}
            value={zoneLetter}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.easting} />
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              accessibilityLabel={t(m.easting)}
              placeholder="XXXXXX"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              keyboardType="number-pad"
              onChangeText={setEasting}
              style={styles.input}
              value={easting}
            />
            <Text style={styles.suffix}>
              <FormattedMessage {...m.eastingSuffix} />
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.northing} />
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              accessibilityLabel={t(m.northing)}
              placeholder="XXXXXX"
              placeholderTextColor="silver"
              underlineColorAndroid="transparent"
              keyboardType="number-pad"
              onChangeText={setNorthing}
              style={styles.input}
              value={northing}
            />
            <Text style={styles.suffix}>
              <FormattedMessage {...m.northingSuffix} />
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UtmForm;
export { m as messages };

function toLatLon({
  easting,
  northing,
  zoneLetter,
  zoneNum,
}: {
  easting: string;
  northing: string;
  zoneLetter: string;
  zoneNum: string;
}) {
  const parsedNorthing = parseNumber(northing);
  let northern: boolean | undefined;
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
      parsedNorthing != null &&
      parsedNorthing >= startOfZoneN &&
      parsedNorthing < startOfZoneP
    ) {
      // Definitely in latitude band N, just use the band letter
    } else {
      // Outside latitude band "N", so the user probably means "Northern"
      northern = true;
    }
  }

  const numericEasting = parseNumber(easting) as number;
  const numericNorthing = parseNumber(northing) as number;
  const numericZoneNum = parseNumber(zoneNum) as number;

  // If northern defined, then don't use the zoneLetter.
  if (northern !== undefined) {
    return origToLatLon(
      numericEasting,
      numericNorthing,
      numericZoneNum,
      undefined,
      northern
    );
  } else {
    return origToLatLon(
      numericEasting,
      numericNorthing,
      numericZoneNum,
      zoneLetter
    );
  }
}

const styles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    color: BLACK,
  },
  input: {
    flex: 1,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    width: "50%",
  },
  suffix: {
    fontSize: 20,
    marginLeft: 5,
    paddingTop: 5,
  },
});
