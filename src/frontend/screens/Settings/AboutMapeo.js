// @flow
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { defineMessages, useIntl } from "react-intl";

import { List, ListItem, ListItemText } from "../../sharedComponents/List";
import useDeviceInfo from "../../hooks/useDeviceInfo";
import { useSetHeader } from "../../hooks/useSetHeader";

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

const DeviceInfoListItem = ({
  label,
  deviceProp,
}: {
  label: string,
  deviceProp: string,
}) => {
  const { formatMessage } = useIntl();
  const { value, state } = useDeviceInfo(deviceProp);
  const displayValue =
    state === "loading"
      ? "…"
      : state === "ready"
      ? value
      : formatMessage(m.unknown);
  return (
    <ListItem>
      <ListItemText primary={label} secondary={displayValue}></ListItemText>
    </ListItem>
  );
};

const AboutMapeo = () => {
  const { formatMessage: t } = useIntl();

  useSetHeader({ headerTitle: m.aboutMapeoTitle });

  return (
    <ScrollView>
      <List>
        <DeviceInfoListItem label={t(m.mapeoVersion)} deviceProp="version" />
        <DeviceInfoListItem label={t(m.mapeoBuild)} deviceProp="buildNumber" />
        <DeviceInfoListItem label={t(m.mapeoType)} deviceProp="bundleId" />
        <DeviceInfoListItem
          label={t(m.androidVersion)}
          deviceProp="systemVersion"
        />
        <DeviceInfoListItem label={t(m.androidBuild)} deviceProp="buildId" />
        <DeviceInfoListItem label={t(m.phoneModel)} deviceProp="model" />
      </List>
    </ScrollView>
  );
};

export default AboutMapeo;
