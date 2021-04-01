// @flow
import React from "react";
import { ScrollView } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import LocationContext from "../../context/LocationContext";
import SettingsContext from "../../context/SettingsContext";

import { formatCoords } from "../../lib/utils";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import Loading from "../../sharedComponents/Loading";
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

const CoordinateSystem = () => {
  const intl = useIntl();
  const location = React.useContext(LocationContext);
  const { settings, dispatch } = React.useContext(SettingsContext);
  const setSystem = React.useCallback(
    value => dispatch({ type: "set_coordinate_system", value }),
    [dispatch]
  );
  const system = settings.coordinateSystem;
  if (!location || !location.position) return <Loading />;
  else {
    const { latitude = 0, longitude = 0 } = location.position.coords;
    const options = [
      {
        value: "dd",
        label: intl.formatMessage({ ...m.dd }),
        hint: formatCoords({
          lon: longitude,
          lat: latitude,
          format: "dd",
        }),
      },
      {
        value: "dms",
        label: intl.formatMessage({ ...m.dms }),
        hint: formatCoords({
          lon: longitude,
          lat: latitude,
          format: "dms",
        }),
      },
      {
        value: "utm",
        label: intl.formatMessage({ ...m.utm }),
        hint: formatCoords({
          lon: longitude,
          lat: latitude,
          format: "utm",
        }),
      },
    ];

    return (
      <ScrollView testID="languageScrollView">
        <SelectOne value={system} options={options} onChange={setSystem} />
      </ScrollView>
    );
  }
};

CoordinateSystem.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
};

export default CoordinateSystem;
