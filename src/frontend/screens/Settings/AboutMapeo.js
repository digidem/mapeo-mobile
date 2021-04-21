// @flow
import React from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import DeviceInfo from "react-native-device-info";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { List, ListItem, ListItemText } from "../../sharedComponents/List";

const m = defineMessages({
  aboutMapeoTitle: {
    id: "screens.AboutMapeo.title",
    defaultMessage: "About Mapeo",
    description: "Title of 'About Mapeo' screen",
  },
  mapeoVersion: {
    id: "screens.AboutMapeo.mapeoVersion",
    defaultMessage: "Mapeo version",
    description: "Label for Mapeo version",
  },
  mapeoBuild: {
    id: "screens.AboutMapeo.mapeoBuild",
    defaultMessage: "Mapeo build",
    description: "Label for Mapeo build number",
  },
  mapeoType: {
    id: "screens.AboutMapeo.mapeoType",
    defaultMessage: "Mapeo variant",
    description:
      "Label for Mapeo type/variant (e.g. QA for testing vs normal version of app)",
  },
  androidVersion: {
    id: "screens.AboutMapeo.androidVersion",
    defaultMessage: "Android version",
    description: "Label for Android version",
  },
  androidBuild: {
    id: "screens.AboutMapeo.androidBuild",
    defaultMessage: "Android build number",
    description: "Label for Android build number",
  },
  phoneModel: {
    id: "screens.AboutMapeo.phoneModel",
    defaultMessage: "Phone model",
    description: "Label for phone model",
  },
  unknown: {
    id: "screens.AboutMapeo.unknownValue",
    defaultMessage: "Unknown",
    description: "Shown when a device info (e.g. version number) is unknown",
  },
});

// Quick custom hook to
function useDeviceInfo(prop) {
  const { formatMessage } = useIntl();
  const methodName = "get" + prop.replace(/^[a-z]/, m => m.toUpperCase());
  const result = React.useMemo(() => DeviceInfo[methodName](), [methodName]);
  const [value, setValue] = React.useState(
    // result type is "object" if it's a Promise
    typeof result === "object" ? "…" : result
  );
  React.useEffect(() => {
    if (typeof result !== "object") return;
    result.then(setValue).catch(e => setValue(formatMessage(m.unknown)));
  }, [formatMessage, result]);
  return value;
}

const DeviceInfoListItem = ({
  label,
  deviceProp,
}: {
  label: string,
  deviceProp: string,
}) => {
  const value = useDeviceInfo(deviceProp);
  return (
    <ListItem>
      <ListItemText primary={label} secondary={value}></ListItemText>
    </ListItem>
  );
};

const AboutMapeo = () => {
  return (
    <List>
      <DeviceInfoListItem label="Mapeo version" deviceProp="version" />
      <DeviceInfoListItem label="Mapeo build" deviceProp="buildNumber" />
      <DeviceInfoListItem label="Mapeo type" deviceProp="bundleId" />
      <DeviceInfoListItem label="Android version" deviceProp="systemVersion" />
      <DeviceInfoListItem label="Android build" deviceProp="buildId" />
      <DeviceInfoListItem label="Phone model" deviceProp="model" />
    </List>
  );
};

AboutMapeo.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.aboutMapeoTitle} />
    </HeaderTitle>
  ),
};

export default AboutMapeo;
