// @flow
import React from "react";
import { ScrollView } from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import useCoodinateSystem from "../../hooks/useCoordinateSystem";
import LocationContext from "../../context/LocationContext";
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
  latlon: {
    id: "screens.CoordinateSystem.latlon",
    defaultMessage: "Latitude and Longitude",
    description: "Latitude and Longitude coordinate system",
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
  dd: {
    id: "screens.CoordinateSystem.dd",
    defaultMessage: "Decimal Degrees (DD)",
    description: "Decimal Degrees coordinate system",
  },
});

const CoordinateSystem = () => {
  const intl = useIntl();
  const location = React.useContext(LocationContext);
  const [system, setSystem] = useCoodinateSystem();
  if (!location) return <Loading />;
  else {
    const { latitude = 0, longitude = 0 } = location.position.coords;
    const options = [
      {
        value: "latlon",
        label: intl.formatMessage({ ...m.latlon }),
        hint: `${latitude} ${longitude}`,
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
      }
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
