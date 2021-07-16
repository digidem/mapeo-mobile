import * as React from "react";
import { View } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { convertDmsToDd, toDegreesMinutesAndSeconds } from "../../../lib/utils";
import {
  CoordinateField,
  FormProps,
  getInitialCardinality,
  parseNumber,
} from "../shared";
import DmsInputGroup from "./DmsInputGroup";

export type DmsData = {
  degrees: string;
  minutes: string;
  seconds: string;
};

export type DmsUnit = keyof DmsData;

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

const DmsForm = ({ coords, onValueUpdate }: FormProps) => {
  const { formatMessage: t } = useIntl();

  const DIRECTION_OPTIONS_NORTH_SOUTH = [
    {
      value: "N",
      label: t(m.north),
    },
    {
      value: "S",
      label: t(m.south),
    },
  ];

  const DIRECTION_OPTIONS_EAST_WEST = [
    {
      value: "E",
      label: t(m.east),
    },
    {
      value: "W",
      label: t(m.west),
    },
  ];

  const [latitude, setLatitude] = React.useState<DmsData>(() => {
    if (typeof coords?.lat !== "number") {
      return {
        degrees: "",
        minutes: "",
        seconds: "",
      };
    }

    const {
      raw: { degrees, minutes, seconds },
    } = toDegreesMinutesAndSeconds(coords.lat);

    return {
      degrees: degrees.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString(),
    };
  });
  const [longitude, setLongitude] = React.useState<DmsData>(() => {
    if (typeof coords?.lon !== "number") {
      return {
        degrees: "",
        minutes: "",
        seconds: "",
      };
    }

    const {
      raw: { degrees, minutes, seconds },
    } = toDegreesMinutesAndSeconds(coords.lon);

    return {
      degrees: degrees.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString(),
    };
  });

  const [latCardinality, setLatCardinality] = React.useState(
    getInitialCardinality("lat", coords)
  );
  const [lonCardinality, setLonCardinality] = React.useState(
    getInitialCardinality("lon", coords)
  );

  const updateCoordinate = (field: CoordinateField) => (
    unit: DmsUnit,
    value: string
  ) => {
    const update = field === "lat" ? setLatitude : setLongitude;
    update(previous => ({ ...previous, [unit]: value }));
  };

  const updateCardinality = (field: CoordinateField) => (value: string) =>
    field === "lat" ? setLatCardinality(value) : setLonCardinality(value);

  React.useEffect(() => {
    try {
      if (
        dmsValuesAreValid("lat", latitude) &&
        dmsValuesAreValid("lon", longitude)
      ) {
        const parsedDmsLat = getParsedDmsValues(latitude);
        const parsedDmsLon = getParsedDmsValues(longitude);

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

function getParsedDmsValues({ degrees, minutes, seconds }: DmsData) {
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

function dmsValuesAreValid(field: CoordinateField, coordinate: DmsData) {
  const parsedDms = getParsedDmsValues(coordinate);

  if (parsedDms) {
    const { degrees, minutes, seconds } = parsedDms;

    const degreeMaximum = field === "lat" ? 90 : 180;

    return degrees <= degreeMaximum && minutes < 60 && seconds < 60;
  } else {
    return false;
  }
}

export default DmsForm;
