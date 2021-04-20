// @flow
import React from "react";
import { Alert } from "react-native";
import { useIntl, defineMessages } from "react-intl";
import createPersistedState from "./usePersistedState";
import useDeviceInfo from "./useDeviceInfo";
import { formats } from "../context/IntlContext";

// Array of [versionName, installTime (millseconds since unix epoc)]
type SavedVersionInfo = [string, number][];

const m = defineMessages({
  dialogTitle: {
    id: "hooks.updateNotifier.dialogTitle",
    description: "Title of dialog shown to the user when Mapeo is updated",
    defaultMessage: "Mapeo Updated",
  },
  dialogMessage: {
    id: "hooks.updateNotifier.dialogMessage",
    description:
      "Message shown in dialog shown to the user when Mapeo is updated",
    defaultMessage:
      "Mapeo was successfully updated from version {previousVersion} to {currentVersion} on {updateDateTime}",
  },
  dialogOk: {
    id: "hooks.updateNotifier.dialogOK",
    description:
      "Button label to dismiss dialog shown to the user when Mapeo is updated",
    defaultMessage: "OK",
  },
});

// Changing this will cause the upgrade notification to not show on the next
// update, so it should not be changed without a migration path
const STORE_KEY = "@MapeoVersion@1";

const usePersistedState = createPersistedState(STORE_KEY);

export default function useUpdateNotifierEffect() {
  const { formatMessage, formatDate } = useIntl();
  const [
    savedVersionInfo,
    savedVersionStatus,
    setSavedVersionInfo,
  ] = usePersistedState<SavedVersionInfo>([]);
  const readableVersion = useDeviceInfo("readableVersion");
  const lastUpdateTime = useDeviceInfo("lastUpdateTime");

  React.useEffect(() => {
    if (
      !(
        savedVersionStatus === "idle" &&
        readableVersion.state === "ready" &&
        lastUpdateTime.state === "ready"
      )
    )
      return;

    const currentVersion = readableVersion.value;
    const currentInstallTime = lastUpdateTime.value;
    // Shouldn't get here, but this makes Flow type checking work
    if (
      typeof currentVersion !== "string" ||
      typeof currentInstallTime !== "number"
    )
      return;

    const previousVersionInfo = savedVersionInfo[savedVersionInfo.length - 1];
    const versionHasChanged =
      previousVersionInfo && previousVersionInfo[0] !== currentVersion;
    if (!versionHasChanged) return;

    setSavedVersionInfo([
      ...savedVersionInfo,
      [currentVersion, currentInstallTime],
    ]);

    Alert.alert(
      formatMessage(m.dialogTitle),
      formatMessage(m.dialogMessage, {
        previousVersion: previousVersionInfo[0],
        currentVersion,
        updateDateTime: formatDate(currentInstallTime, formats.date.long),
      }),
      [{ text: formatMessage(m.dialogOk) }]
    );
  }, [
    savedVersionStatus,
    readableVersion.state,
    lastUpdateTime.state,
    readableVersion.value,
    lastUpdateTime.value,
    savedVersionInfo,
    setSavedVersionInfo,
    formatMessage,
    formatDate,
  ]);
}
