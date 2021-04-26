// @flow
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { MaterialIndicator } from "react-native-indicators";
import { View, StyleSheet } from "react-native";

import Text from "../../sharedComponents/Text";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { DoneIcon, ErrorIcon } from "../../sharedComponents/icons";
import Progress from "../../sharedComponents/icons/Progress";
import DotIndicator from "./DotIndicator";
import { peerStatus } from "./PeerList";
import { UpgradeState as BackendUpgradeState } from "../../../backend/lib/constants";
import ApkInstaller from "../../lib/ApkInstaller";
import type { Peer } from "./PeerList";
import api from "../../api";

import debug from "debug";
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
    defaultMessage: "Unable to update",
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
    defaultMessage: "Install Update",
  },
  openSettingsButton: {
    id: "screens.SyncModal.SyncView.openSettingsButton",
    description:
      "Label for button to open settings to fix update permissions error",
    defaultMessage: "Open Settings",
  },
});

type UpgradeState =
  | "Pending" // Before first state update is received
  | "Searching"
  | "Downloading"
  | "GenericError"
  | "PermissionError"
  | "ReadyToUpgrade"
  | "NoUpdatesFound"
  | "WaitingForSync"
  | "Draining"
  | "Unknown";

const TextButton = ({ title }) => (
  <Text style={styles.textButton}>{title}</Text>
);

const UpgradeBar = ({ peers }: { peers: Peer[] }) => {
  const { formatMessage: t } = useIntl();
  const [backendState, setBackendState] = React.useState();

  // Start listening to updates from the backend on mount, and stop listening on
  // unmount
  React.useEffect(() => {
    const stateSubscription = api.addP2pUpgradeStateListener(state =>
      setBackendState(state)
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

  const upgradeInfo = React.useMemo(() => getUpgradeInfo(backendState, peers), [
    backendState,
    peers,
  ]);

  function onInstallPress() {
    if (upgradeInfo.state !== "ReadyToUpgrade") {
      log("### UPGRADE: not in ready state");
      return;
    }
    ApkInstaller.install(upgradeInfo.context.filename)
      .then(() => {
        log("### UPGRADE: install ok!");
      })
      .catch(err => {
        log("### UPGRADE: apk install failed", err);
      });
  }

  return (
    <TouchableNativeFeedback>
      <View style={styles.upgradeBar}>
        {(() => {
          switch (upgradeInfo.state) {
            case "Searching":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Text style={styles.upgradeBarText} numberOfLines={1}>
                    <FormattedMessage {...m.checkingUpdates} />
                  </Text>
                  <View style={{ flex: 1 }}></View>
                  <DotIndicator style={{ flex: 1 }} size={7} />
                </View>
              );
            case "WaitingForSync":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.updateAwaitingSync} />
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}></View>
                  <DotIndicator style={{ flex: 1 }} size={7} />
                </View>
              );
            case "Downloading":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updateDownloading} />
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}></View>
                  <Progress
                    progress={upgradeInfo.context.progress}
                    size={25}
                    color="#3568f5"
                  />
                </View>
              );
            case "GenericError":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updateGenericError} />
                    </Text>
                    <Text
                      style={styles.upgradeBarTextSecondary}
                      numberOfLines={1}
                    >
                      {upgradeInfo.context}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, justifyContent: "center" }}>
                    <ErrorIcon color="red" />
                  </View>
                </View>
              );
            case "PermissionError":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 8, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.updatePermissionError} />
                    </Text>
                    <Text
                      style={styles.upgradeBarTextSecondary}
                      numberOfLines={1}
                    >
                      {upgradeInfo.context}
                    </Text>
                  </View>
                  <View style={{ flex: 5, justifyContent: "center" }}>
                    <TextButton title={t(m.openSettingsButton)} />
                  </View>
                </View>
              );
            case "NoUpdatesFound":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={1}>
                      <FormattedMessage {...m.noUpdates} />
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, justifyContent: "center" }}>
                    <DoneIcon color="#00FF00" />
                  </View>
                </View>
              );
            case "ReadyToUpgrade":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 6, flexDirection: "column" }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.updateReady} />
                    </Text>
                  </View>
                  <View style={{ flex: 2 }} />
                  <View style={{ flex: 5, justifyContent: "center" }}>
                    <TouchableNativeFeedback onPress={onInstallPress}>
                      <TextButton
                        title={t(m.installUpdateButton)}
                        onPress={onInstallPress}
                      />
                    </TouchableNativeFeedback>
                  </View>
                </View>
              );
            case "Draining":
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 6 }}>
                    <Text style={styles.upgradeBarText} numberOfLines={2}>
                      <FormattedMessage {...m.sharingUpdate} />
                    </Text>
                  </View>
                  <View style={{ flex: 3 }} />
                  <View style={{ flex: 1.5 }}>
                    <MaterialIndicator
                      animationDuration={8000}
                      size={35}
                      color="#3568f5"
                    />
                  </View>
                </View>
              );
            default:
              return (
                <Text style={styles.upgradeBarText} numberOfLines={1}>
                  <FormattedMessage {...m.updateUnkownState} />
                </Text>
              );
          }
        })()}
      </View>
    </TouchableNativeFeedback>
  );
};

function getUpgradeInfo(state, peers): { state: UpgradeState, context: any } {
  if (!state) {
    return {
      state: "Pending",
      context: null,
    };
  }
  // Error present in ANY subsystem.
  if (state.server.state === BackendUpgradeState.Server.Error) {
    return {
      state: "GenericError",
      context: state.server.context.message,
    };
  }
  if (state.downloader.search.state === BackendUpgradeState.Search.Error) {
    return {
      state: "GenericError",
      context: state.downloader.search.context.message,
    };
  }
  if (state.downloader.download.state === BackendUpgradeState.Download.Error) {
    return {
      state: "GenericError",
      context: state.downloader.download.context.message,
    };
  }
  if (state.downloader.check.state === BackendUpgradeState.Check.Error) {
    return {
      state: "GenericError",
      context: state.downloader.check.context.message,
    };
  }

  // Edge case I've (kira) seen once that shouldn't happen.
  if (state.downloader.search.state === BackendUpgradeState.Search.Idle) {
    return {
      state: "GenericError",
      context: "Search did not initialize correctly.",
    };
  }

  // Upgrade available + waiting for syncs to finish.
  if (
    state.downloader.check.state === BackendUpgradeState.Check.Available &&
    peers.some(p => p.status === peerStatus.PROGRESS)
  ) {
    return { state: "WaitingForSync", context: null };
  }

  // Upgrade available + not waiting for syncs to finish.
  if (state.downloader.check.state === BackendUpgradeState.Check.Available) {
    return {
      state: "ReadyToUpgrade",
      context: state.downloader.check.context,
    };
  }

  // Upgrade is downloading.
  if (
    state.downloader.download.state === BackendUpgradeState.Download.Downloading
  ) {
    const progress = state.downloader.download.context;
    return {
      state: "Downloading",
      context: { progress: progress.sofar / progress.total },
    };
  }

  // Subsystem has been searching for upgrades for < 14 seconds.
  if (
    state.downloader.search.state === BackendUpgradeState.Search.Searching &&
    Date.now() - state.downloader.search.context.startTime < 14 * 1000
  ) {
    return { state: "Searching", context: null };
  }

  // Subsystem is still uploading an upgrade to other peers.
  if (
    (state.server.state === BackendUpgradeState.Server.Sharing ||
      state.server.state === BackendUpgradeState.Server.Draining) &&
    state.server.context.length > 0
  ) {
    return { state: "Draining", context: null };
  }

  // Subsystem has been searching for upgrades for > 14 seconds.
  if (state.downloader.search.state === BackendUpgradeState.Search.Searching) {
    return { state: "NoUpdatesFound", context: null };
  }

  return { state: "Unknown", context: null };
}

export default UpgradeBar;

const styles = StyleSheet.create({
  upgradeBar: {
    backgroundColor: "#000034",
    height: 84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  upgradeBarText: {
    color: "white",
    fontWeight: "bold",
    paddingLeft: 10,
    fontSize: 18,
  },
  upgradeBarTextSecondary: {
    color: "white",
    paddingLeft: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
  textButton: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 7,
    color: "white",
  },
});
