// @flow
import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import Text from "../../../sharedComponents/Text";
import Select from "../../../sharedComponents/Select";
import { BLACK, LIGHT_GREY } from "../../../lib/styles";
import { convertDmsToDd, toDegreesMinutesAndSeconds } from "../../../lib/utils";
import { type FormProps, getInitialCardinality, parseNumber } from "../shared";
import DmsInputGroup from "./DmsInputGroup";

const m = defineMessages({
  invalidCoordinates: {
    id: "screens.ManualGpsScreen.DmsForm.invalidCoordinates",
    defaultMessage: "Invalid coordinates",
  },
  latitude: {
    id: "screens.ManualGpsScreen.DmsForm.latitude",
    defaultMessage: "Latitude",
  },
  longitude: {
    id: "screens.ManualGpsScreen.DmsForm.longitude",
    defaultMessage: "Longitude",
  },
  north: {
    id: "screens.ManualGpsScreen.DmsForm.north",
    defaultMessage: "North",
  },
  south: {
    id: "screens.ManualGpsScreen.DmsForm.south",
    defaultMessage: "South",
  },
  east: {
    id: "screens.ManualGpsScreen.DmsForm.east",
    defaultMessage: "East",
  },
  west: {
    id: "screens.ManualGpsScreen.DmsForm.west",
    defaultMessage: "West",
  },
});

export type DmsData = {|
  degrees: string,
  minutes: string,
  seconds: string,
|};

export type DmsUnit = $Keys<DmsData>;

const DmsForm = ({ location, onValueUpdate }: FormProps) => {
  const { formatMessage } = useIntl();

  const DIRECTION_OPTIONS_NORTH_SOUTH = [
    {
      value: "N",
      label: formatMessage(m.north),
    },
    {
      value: "S",
      label: formatMessage(m.south),
    },
  ];

  const DIRECTION_OPTIONS_EAST_WEST = [
    {
      value: "E",
      label: formatMessage(m.east),
    },
    {
      value: "W",
      label: formatMessage(m.west),
    },
  ];

  const [latitude, setLatitude] = React.useState<DmsData>(() => {
    if (!location.savedPosition)
      return {
        degrees: "",
        minutes: "",
        seconds: "",
      };

    const { latitude } = location.savedPosition.coords;
    const {
      raw: { degrees, minutes, seconds },
    } = toDegreesMinutesAndSeconds(latitude);

    return {
      degrees: degrees.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString(),
    };
  });
  const [longitude, setLongitude] = React.useState<DmsData>(() => {
    if (!location.savedPosition)
      return {
        degrees: "",
        minutes: "",
        seconds: "",
      };

    const { longitude } = location.savedPosition.coords;
    const {
      raw: { degrees, minutes, seconds },
    } = toDegreesMinutesAndSeconds(longitude);

    return {
      degrees: degrees.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString(),
    };
  });

  const [latCardinality, setLatCardinality] = React.useState(
    getInitialCardinality("lat", location)
  );
  const [lonCardinality, setLonCardinality] = React.useState(
    getInitialCardinality("lon", location)
  );

  const updateCoordinate = (field: "lat" | "lon") => (
    unit: DmsUnit,
    value: string
  ) => {
    const update = field === "lat" ? setLatitude : setLongitude;

    // Ideally would use computed property syntax to avoid this but Flow is being annoying
    update(previous => {
      switch (unit) {
        case "degrees":
          return {
            ...previous,
            degrees: value,
          };
        case "minutes":
          return {
            ...previous,
            minutes: value,
          };
        case "seconds":
          return {
            ...previous,
            seconds: value,
          };
        default:
          return previous;
      }
    });
  };

  const updateCardinality = (field: "lat" | "lon") => (value: string) =>
    field === "lat" ? setLatCardinality(value) : setLonCardinality(value);

  React.useEffect(() => {
    try {
      if (
        dmsValuesAreValid("lat", latitude) &&
        dmsValuesAreValid("lon", longitude)
      ) {
        const parsedDmsLat = getParsedDmsValues("lat", latitude);
        const parsedDmsLon = getParsedDmsValues("lon", longitude);

        if (parsedDmsLat && parsedDmsLon) {
          onValueUpdate({
            coords: {
              lat:
                convertDmsToDd(parsedDmsLat) *
                (latCardinality === "N" ? 1 : -1),
              lon:
                convertDmsToDd(parsedDmsLon) *
                (lonCardinality === "E" ? 1 : -1),
            },
          });
        }
      } else {
        throw new Error(m.invalidCoordinates.defaultMessage);
      }
    } catch (err) {
      onValueUpdate({
        error: err,
      });
    }
  }, [latitude, longitude, latCardinality, lonCardinality, onValueUpdate]);

  return (
    <View>
      <DmsInputGroup
        cardinalityOptions={DIRECTION_OPTIONS_NORTH_SOUTH}
        coordinate={latitude}
        label={<FormattedMessage {...m.latitude} />}
        selectedCardinality={latCardinality}
        updateCardinality={updateCardinality("lat")}
        updateCoordinate={updateCoordinate("lat")}
      />

      <DmsInputGroup
        cardinalityOptions={DIRECTION_OPTIONS_EAST_WEST}
        coordinate={longitude}
        label={<FormattedMessage {...m.longitude} />}
        selectedCardinality={lonCardinality}
        updateCardinality={updateCardinality("lon")}
        updateCoordinate={updateCoordinate("lon")}
      />
    </View>
  );
};

function getParsedDmsValues(
  field: "lat" | "lon",
  { degrees, minutes, seconds }: DmsData
) {
  const degreesParsed = parseNumber(degrees);
  const minutesParsed = parseNumber(minutes);
  const secondsParsed = parseNumber(seconds);

  if (
    degreesParsed !== undefined &&
    minutesParsed !== undefined &&
    secondsParsed !== undefined
  ) {
    return {
      degrees: degreesParsed,
      minutes: minutesParsed,
      seconds: secondsParsed,
    };
  }
}

function dmsValuesAreValid(field: "lat" | "lon", coordinate: DmsData) {
  const parsedDms = getParsedDmsValues(field, coordinate);

  if (parsedDms) {
    const { degrees, minutes, seconds } = parsedDms;

    const degreeMaximum = field === "lat" ? 90 : 180;

    return degrees <= degreeMaximum && minutes < 60 && seconds < 60;
  } else {
    return false;
  }
}

export default DmsForm;
