// @flow
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { MaterialIndicator } from "react-native-indicators";
import { View, StyleSheet, Alert } from "react-native";
import { useAppState } from "@react-native-community/hooks";

import Text from "../../sharedComponents/Text";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { DoneIcon, ErrorIcon } from "../../sharedComponents/icons";
import Progress from "../../sharedComponents/icons/Progress";
import DotIndicator from "./DotIndicator";
import api, { type UpgradeState, type TransferProgress } from "../../api";
import ApkInstaller from "../../lib/ApkInstaller";

import debug from "debug";
import Button from "../../sharedComponents/Button";
const log = debug("mapeo-mobile:SyncModal:index");

const m = defineMessages({
  checkingUpdates: {
    id: "screens.SyncModal.SyncView.checkingUpdates",
    description: "Label in upgrade bar when checking for updates",
    defaultMessage: "Checking for app updates",
  },
  updateAwaitingSync: {
    id: "screens.SyncModal.SyncView.updateAwaitingSync",
    description: "Label in upgrade bar when waiting for sync to complete",
    defaultMessage: "Update available; waiting for sync to finish",
  },
  updateDownloading: {
    id: "screens.SyncModal.SyncView.updateDownloading",
    description: "Label in upgrade bar when downloading an update",
    defaultMessage: "Downloading updates",
  },
  updateGenericError: {
    id: "screens.SyncModal.SyncView.updateGenericError",
    description:
      "Label in upgrade bar when there is an error getting an update",
    defaultMessage: "Unable to check for updates",
  },
  updatePermissionError: {
    id: "screens.SyncModal.SyncView.updatePermissionError",
    description:
      "Label in upgrade bar when there is permissions error getting an update",
    defaultMessage: "Unable to update",
  },
  noUpdates: {
    id: "screens.SyncModal.SyncView.noUpdates",
    description: "Label in upgrade bar when no updates are found",
    defaultMessage: "No app updates found",
  },
  updateReady: {
    id: "screens.SyncModal.SyncView.updateReady",
    description: "Label in upgrade bar when an update is available",
    defaultMessage: "A new version of Mapeo is available",
  },
  sharingUpdate: {
    id: "screens.SyncModal.SyncView.sharingUpdate",
    description: "Label in upgrade bar when sharing an update with others",
    defaultMessage: "Sharing app updates with other devices",
  },
  updateUnknownState: {
    id: "screens.SyncModal.SyncView.updateUnknownState",
    description:
      "Label in upgrade bar when an unknown update state is detected (should not happen)",
    defaultMessage: "Unimplemented state",
  },
  installUpdateButton: {
    id: "screens.SyncModal.SyncView.installUpdateButton",
    description: "Label for button to install an update",
    defaultMessage: "Install",
  },
  openSettingsButton: {
    id: "screens.SyncModal.SyncView.openSettingsButton",
    description:
      "Label for button to open settings to fix update permissions error",
    defaultMessage: "Open Settings",
  },
});

function useUpgradeState(): UpgradeState {
  const appState = useAppState();
  const [upgradeState, setUpgradeState] = React.useState<UpgradeState>(
    initialUpgradeState
  );

  // Start listening to updates from the backend on mount, and stop listening on
  // unmount
  React.useEffect(() => {
    const stateSubscription = api.addP2pUpgradeStateListener(state =>
      setUpgradeState(state)
    );
    const errorSubscription = api.addP2pUpgradeErrorListener(err => {
      // TODO: Show error alert
      log("BACKEND STATE ERROR", err.message);
    });
    return () => {
      stateSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (appState !== "active") return;
    api.startP2pUpgradeServices();
    return () => {
      api.stopP2pUpgradeServices();
    };
  }, [appState]);

  return upgradeState;
}

const UpgradeBarContainer = ({ children }: { children: React.Node }) => (
  <View style={styles.upgradeBar}>{children}</View>
);

const UpgradeBarText = ({
  primary,
  secondary = null,
}: {
  primary: React.Node,
  secondary?: React.Node,
}) => (
  <View style={{ flex: 1 }}>
    <Text style={styles.upgradeBarText} textBreakStrategy="balanced">
      {primary}
    </Text>
    {secondary && (
      <Text style={styles.upgradeBarTextSecondary}>{secondary}</Text>
    )}
  </View>
);

const AwaitingSync = () => (
  <UpgradeBarContainer>
    <UpgradeBarText primary={<FormattedMessage {...m.updateAwaitingSync} />} />
    <DotIndicator style={{ flex: 0, padding: 10 }} size={7} />
  </UpgradeBarContainer>
);

const AvailableUpdate = ({ onPress }: { onPress: () => void }) => {
  const { formatMessage: t } = useIntl();
  return (
    <UpgradeBarContainer>
      <UpgradeBarText primary={<FormattedMessage {...m.updateReady} />} />
      <Button variant="outlined" color="light" onPress={onPress}>
        {t(m.installUpdateButton)}
      </Button>
    </UpgradeBarContainer>
  );
};

const Searching = () => (
  <UpgradeBarContainer>
    <UpgradeBarText primary={<FormattedMessage {...m.checkingUpdates} />} />
    <DotIndicator style={{ flex: 0, padding: 10 }} size={7} />
  </UpgradeBarContainer>
);

const Downloading = ({ progress }: { progress: number }) => (
  <UpgradeBarContainer>
    <UpgradeBarText primary={<FormattedMessage {...m.updateDownloading} />} />
    <Progress progress={progress} size={25} color="#3568f5" />
  </UpgradeBarContainer>
);

const Uploading = ({ progress }: { progress: number }) => (
  <UpgradeBarContainer>
    <UpgradeBarText primary={<FormattedMessage {...m.sharingUpdate} />} />
    <Progress progress={progress} size={25} color="#3568f5" />
  </UpgradeBarContainer>
);

const UpgradeError = () => (
  <UpgradeBarContainer>
    <UpgradeBarText primary={<FormattedMessage {...m.updateGenericError} />} />
  </UpgradeBarContainer>
);

const initialUpgradeState = {
  value: "stopped",
  downloads: [],
  uploads: [],
};

const UpgradeBar = ({ isSyncing }: { isSyncing: boolean }) => {
  const {
    value: state,
    downloads,
    uploads,
    availableUpgrade,
  } = useUpgradeState();

  function onInstallPress() {
    if (!availableUpgrade) {
      // This should be impossible to reach because the button will not render
      // if availableUpgrade is undefined
      log("### UPGRADE: unexpectedly upgrade is not available");
      return;
    }
    ApkInstaller.install(availableUpgrade.filepath)
      .then(() => {
        log("### UPGRADE: install ok!");
      })
      .catch(err => {
        Alert.alert("Install Error", err.message, [{ text: "OK" }]);
      });
  }

  if (state === "error") {
    return <UpgradeError />;
  } else if (availableUpgrade && !downloads.length && !uploads.length) {
    if (isSyncing) return <AwaitingSync />;
    return <AvailableUpdate onPress={onInstallPress} />;
  } else if (downloads.length) {
    const progress = calculateProgress(downloads);
    return <Downloading progress={progress} />;
  } else if (uploads.length) {
    const progress = calculateProgress(uploads);
    return <Uploading progress={progress} />;
  } else {
    return <Searching />;
  }
};

function calculateProgress(transfers: TransferProgress[]): number {
  let sofarTotal = 0;
  let totalTotal = 0;
  for (const { sofar, total } of transfers) {
    sofarTotal += sofar;
    totalTotal += total;
  }
  return sofarTotal / totalTotal;
}

export default UpgradeBar;

const styles = StyleSheet.create({
  upgradeBar: {
    backgroundColor: "#000034",
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  upgradeBarText: {
    color: "white",
    fontWeight: "bold",
    paddingLeft: 10,
    fontSize: 18,
    lineHeight: 25,
  },
  upgradeBarTextSecondary: {
    color: "white",
    paddingLeft: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
});
