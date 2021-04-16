// @flow
import React from "react";
import { ScrollView } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import LocationContext from "../../context/LocationContext";
import SettingsContext from "../../context/SettingsContext";

import { formatCoords } from "../../lib/utils";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import SelectOne from "./SelectOne";

const m = defineMessages({
  title: {
    id: "screens.CoordinateSystem.title",
    defaultMessage: "Coordinate System",
    description: "Title coordinate system screen",
  },
  dd: {
    id: "screens.CoordinateSystem.dd",
    defaultMessage: "Decimal Degrees (DD)",
    description: "Decimal Degrees coordinate system",
  },
  dms: {
    id: "screens.CoordinateSystem.dms",
    defaultMessage: "Degrees/Minutes/Seconds (DMS)",
    description: "Degrees/Minutes/Seconds coordinate system",
  },
  utm: {
    id: "screens.CoordinateSystem.utm",
    defaultMessage: "Universal Transverse Mercator (UTM)",
    description: "Universal Transverse Mercator coordinate system",
  },
});

// Default location used to show how coordinates will be formatted. Uses current
// user location if available
const EXAMPLE_LOCATION = { longitude: -72.312023, latitude: -10.38787 };

const CoordinateSystem = () => {
  const intl = useIntl();
  const location = React.useContext(LocationContext);
  const [{ coordinateSystem }, setSettings] = React.useContext(SettingsContext);

  const { latitude: lat, longitude: lon } =
    (location.position && location.position.coords) || EXAMPLE_LOCATION;

  const options = ["dd", "dms", "utm"].map(format => ({
    value: format,
    label: intl.formatMessage(m[format]),
    hint: formatCoords({ lon, lat, format }),
  }));

  return (
    <ScrollView testID="languageScrollView">
      <SelectOne
        value={coordinateSystem}
        options={options}
        onChange={format => setSettings("coordinateSystem", format)}
      />
    </ScrollView>
  );
};

CoordinateSystem.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
};

export default CoordinateSystem;
