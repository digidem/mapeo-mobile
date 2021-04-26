// @flow
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { MaterialIndicator } from "react-native-indicators";
import { View, StyleSheet } from "react-native";
import rnBridge from "nodejs-mobile-react-native";

import Text from "../../sharedComponents/Text";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { DoneIcon, ErrorIcon } from "../../sharedComponents/icons";
import Progress from "../../sharedComponents/icons/Progress";
import DotIndicator from "./DotIndicator";
import { peerStatus } from "./PeerList";
import { UpgradeState as BackendUpgradeState } from "../../../backend/lib/constants";
import ApkInstaller from "../../lib/ApkInstaller";
import type { Peer } from "./PeerList";

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

const UpgradeState = {
  Searching: 0,
  Downloading: 1,
  GenericError: 2,
  PermissionError: 3,
  ReadyToUpgrade: 4,
  NoUpdatesFound: 5,
  WaitingForSync: 6,
  Draining: 7,
  Unknown: 8,
};

const TextButton = ({ title }) => (
  <Text style={styles.textButton}>{title}</Text>
);

const UpgradeBar = ({ peers }: { peers: Peer[] }) => {
  const { formatMessage: t } = useIntl();
  const [upgradeInfo, setUpgradeInfo] = React.useState({});
  const [backendState, setBackendState] = React.useState({});

  // HACK(kira): I wanted the backend state tracking effect to be able to also
  // trigger a re-render on an interval, which is what this state is for. I'm
  // sure there's a nicer way to accomplish this.
  const [fakeTrigger, setFakeTrigger] = React.useState(0);

  // P2P Upgrades effects
  // ----------------------------------------------------------------------
  // Backend State + Peers => Frontend render effect
  React.useEffect(() => {
    if (!backendState.server) return;
    const rState = getFrontendStateFromUpgradeState(backendState, peers);
    setUpgradeInfo(rState);
  }, [peers, backendState, fakeTrigger]);

  // Backend state tracking effect. Interfaces with Node process for state &
  // control.
  React.useEffect(() => {
    let iv;
    function onState(state) {
      log("GOT BACKEND STATE", JSON.stringify(state));
      setBackendState(state);
    }

    function onError(err) {
      log("BACKEND STATE ERROR", err.message);
      setUpgradeInfo({
        state: UpgradeState.GenericError,
        context: err.message,
      });
    }

    function onReady() {
      rnBridge.channel.removeListener("p2p-upgrades-backend-ready", onReady);
      log("backend says they are ready!");
      rnBridge.channel.post("p2p-upgrades-frontend-ready");

      rnBridge.channel.addListener("p2p-upgrade::error", onError);
      rnBridge.channel.addListener("p2p-upgrade::state", onState);
      iv = setInterval(() => {
        setFakeTrigger(Math.random());
      }, 3000);

      rnBridge.channel.post("p2p-upgrade::get-state");
      rnBridge.channel.post("p2p-upgrade::start-services");
    }
    log("startup", upgradeInfo);
    rnBridge.channel.addListener("p2p-upgrades-backend-ready", onReady);
    rnBridge.channel.post("p2p-upgrades-frontend-ready");
    setUpgradeInfo({ state: UpgradeState.Searching });

    return () => {
      log("cleanup!");
      if (iv) clearInterval(iv);
      rnBridge.channel.removeListener("p2p-upgrade::state", onState);
      rnBridge.channel.removeListener("p2p-upgrade::error", onError);
      rnBridge.channel.post("p2p-upgrade::stop-services");
    };
  }, []);
  // ----------------------------------------------------------------------

  function onInstallPress() {
    if (upgradeInfo.state !== UpgradeState.ReadyToUpgrade) {
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
            case UpgradeState.Searching:
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
            case UpgradeState.WaitingForSync:
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
            case UpgradeState.Downloading:
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
            case UpgradeState.GenericError:
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
            case UpgradeState.PermissionError:
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
            case UpgradeState.NoUpdatesFound:
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
            case UpgradeState.ReadyToUpgrade:
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
            case UpgradeState.Draining:
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

function getFrontendStateFromUpgradeState(state, peers) {
  // Error present in ANY subsystem.
  if (state.server.state === BackendUpgradeState.Server.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.server.context.message,
    };
  }
  if (state.downloader.search.state === BackendUpgradeState.Search.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.search.context.message,
    };
  }
  if (state.downloader.download.state === BackendUpgradeState.Download.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.download.context.message,
    };
  }
  if (state.downloader.check.state === BackendUpgradeState.Check.Error) {
    return {
      state: UpgradeState.GenericError,
      context: state.downloader.check.context.message,
    };
  }

  // Edge case I've (kira) seen once that shouldn't happen.
  if (state.downloader.search.state === BackendUpgradeState.Search.Idle) {
    return {
      state: UpgradeState.GenericError,
      context: "Search did not initialize correctly.",
    };
  }

  // Upgrade available + waiting for syncs to finish.
  if (
    state.downloader.check.state === BackendUpgradeState.Check.Available &&
    peers.some(p => p.status === peerStatus.PROGRESS)
  ) {
    return { state: UpgradeState.WaitingForSync, context: null };
  }

  // Upgrade available + not waiting for syncs to finish.
  if (state.downloader.check.state === BackendUpgradeState.Check.Available) {
    return {
      state: UpgradeState.ReadyToUpgrade,
      context: state.downloader.check.context,
    };
  }

  // Upgrade is downloading.
  if (
    state.downloader.download.state === BackendUpgradeState.Download.Downloading
  ) {
    const progress = state.downloader.download.context;
    return {
      state: UpgradeState.Downloading,
      context: { progress: progress.sofar / progress.total },
    };
  }

  // Subsystem has been searching for upgrades for < 14 seconds.
  if (
    state.downloader.search.state === BackendUpgradeState.Search.Searching &&
    Date.now() - state.downloader.search.context.startTime < 14 * 1000
  ) {
    return { state: UpgradeState.Searching, context: null };
  }

  // Subsystem is still uploading an upgrade to other peers.
  if (
    (state.server.state === BackendUpgradeState.Server.Sharing ||
      state.server.state === BackendUpgradeState.Server.Draining) &&
    state.server.context.length > 0
  ) {
    return { state: UpgradeState.Draining, context: null };
  }

  // Subsystem has been searching for upgrades for > 14 seconds.
  if (state.downloader.search.state === BackendUpgradeState.Search.Searching) {
    return { state: UpgradeState.NoUpdatesFound, context: null };
  }

  return { state: UpgradeState.Unknown, context: null };
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
