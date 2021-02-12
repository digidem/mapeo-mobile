import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { defineMessages, useIntl } from "react-intl";
import { peerStatus } from "./PeerList";
import path from "path";
import api from "../../api";

const m = defineMessages({
  // Error message when trying to sync with an incompatible older version of Mapeo
  errorMsgVersionThemBad: {
    id: "screens.SyncModal.errorVersionThemBadTitle",
    defaultMessage: "{deviceName} needs to upgrade Mapeo",
    description:
      "Title of error alert when trying to sync with an incompatible older version of Mapeo",
  },
  // Error messagewhen trying to sync with an incompatible newer version of Mapeo
  errorVersionThemBadDesc: {
    id: "screens.SyncModal.errorVersionThemBadDesc",
    defaultMessage:
      "The device you are trying to sync with needs to upgrade Mapeo to the latest version in order to sync with you.",
    description:
      "Content of error alert when trying to sync with an incompatible older version of Mapeo",
  },
  errorVersionUsBadDesc: {
    id: "screens.SyncModal.errorVersionUsBadDesc",
    defaultMessage:
      "The device you are trying to sync has a newer version of Mapeo. You need to upgrade Mapeo in order to sync with this device.",
    description:
      "Content of error alert when trying to sync with an incompatible newer version of Mapeo",
  },
  errorMsgVersionUsBad: {
    id: "screens.SyncModal.errorVersionUsBadTitle",
    defaultMessage: "You need to upgrade Mapeo to sync with {deviceName}",
    description:
      "Title of error alert when trying to sync with an incompatible older version of Mapeo",
  },
});

const IGNORED_ERROR_CODES = ["ECONNABORTED", "ERR_MISSING_DATA"];

export default function usePeers(listen, deviceName) {
  const { formatMessage: t } = useIntl();
  const lastClosed = useRef(Date.now());
  const [serverPeers, setServerPeers] = React.useState([]);
  const [syncErrors, setSyncErrors] = React.useState(new Map());
  const [syncRequests, setSyncRequests] = React.useState(new Map());

  // Keep a ref of the last time this view was closed (used to maintain peer
  // 'completed' state in the UI)
  useEffect(() => {
    if (!listen) lastClosed.current = Date.now();
  }, [listen]);

  useEffect(() => {
    // Only start listening if `listen` is true
    if (!listen) return;

    // Whenever the sync view becomes focused, announce for sync and start
    // listening for updates to peer status
    api.syncJoin(deviceName);
    const peerListener = api.addPeerListener(updatePeers);

    // When the listen changes or component unmounts, cleanup listeners
    return () => {
      api.syncLeave();
      if (peerListener) peerListener.remove();
    };
  }, [listen, deviceName]);

  const updatePeers = (updatedServerPeers = []) => {
    setServerPeers(updatedServerPeers);
    // NB: use callback version of setState because the new error state
    // depends on the previous error state
    setSyncErrors(syncErrors => {
      const newErrors = new Map(syncErrors);
      updatedServerPeers.forEach(peer => {
        if (peer.state && peer.state.topic === "replication-error") {
          peer.state.isNewError = !syncErrors.has(peer.id);
          if (IGNORED_ERROR_CODES.indexOf(peer.state.code) === -1) {
            newErrors.set(peer.id, peer.state);
          }
        } else {
          newErrors.delete(peer.id);
        }
      });
      return newErrors;
    });
    // Argh, this is hacky. This is making up for us not being able to rely
    // on server state for rendering the UI
    setSyncRequests(syncRequests => {
      const newSyncRequests = new Map(syncRequests);

      updatedServerPeers.forEach(peer => {
        if (!peer.state) return;
        if (
          (peer.state.topic === "replication-error" ||
            peer.state.topic === "replication-complete") &&
          !peer.connected
        ) {
          newSyncRequests.delete(peer.id);
        }
      });
      return newSyncRequests;
    });
  };

  const peers = useMemo(
    () =>
      getPeersStatus({
        syncRequests,
        serverPeers,
        syncErrors,
        since: lastClosed.current,
        t,
      }),
    [serverPeers, syncErrors, syncRequests, t]
  );

  const syncPeer = useCallback(
    (peerId, opts) => {
      if (opts && opts.file) return api.syncStart({ filename: peerId });
      const peer = serverPeers.find(peer => peer.id === peerId);
      // Peer could have vanished in the moment the button was pressed
      if (peer) {
        // The server does always respond immediately with progress, especially
        // if the two devices are already up to sync. We store the request state
        // so the user can see the UI update when they click the button
        setSyncRequests(syncRequests => {
          const newSyncRequests = new Map(syncRequests);
          newSyncRequests.set(peerId, true);
          return newSyncRequests;
        });
        api.syncStart(peer);
      }
    },
    [serverPeers]
  );

  const syncGetPeers = useCallback(() => {
    api.syncGetPeers().then(updatePeers);
  }, []);

  const connectCloud = url => {
    api.connectCloud({ url });
  };

  return [peers, syncPeer, syncGetPeers, connectCloud];
}

/**
 * The peer status from Mapeo Core does not 'remember' the completion of a sync.
 * If the user is not looking at the screen when sync completes, they might miss
 * it. This function derives a peer status from the server state and any errors
 */
function getPeersStatus({
  serverPeers = [],
  syncErrors,
  syncRequests,
  since,
  t,
}) {
  return serverPeers.map(serverPeer => {
    let status = peerStatus.READY;
    let complete;
    const state = serverPeer.state || {};
    const name = serverPeer.filename
      ? path.basename(serverPeer.filename)
      : serverPeer.name;
    if (
      state.topic === "replication-progress" ||
      state.topic === "replication-started" ||
      syncRequests.has(serverPeer.id)
    ) {
      status = peerStatus.PROGRESS;
    } else if (
      (typeof state.lastCompletedDate === "number"
        ? state.lastCompletedDate
        : 0) > since ||
      state.topic === "replication-complete"
    ) {
      status = peerStatus.COMPLETE;
      complete = state.message;
    } else if (syncErrors.has(serverPeer.id)) {
      status = peerStatus.ERROR;
      const error = syncErrors.get(serverPeer.id);
      if (error && error.code === "ERR_VERSION_MISMATCH") {
        if (
          parseVersionMajor(error.usVersion || "") >
          parseVersionMajor(error.themVersion || "")
        ) {
          state.errorMsg = t(m.errorMsgVersionThemBad, { deviceName: name });
          state.errorDesc = t(m.errorVersionThemBadDesc, {
            deviceName: name,
          });
        } else {
          state.errorMsg = t(m.errorMsgVersionUsBad, { deviceName: name });
          state.errorDesc = t(m.errorVersionUsBadDesc, { deviceName: name });
        }
      } else if (error) {
        state.errorMsg = error.message || "Error";
      }
    }
    return {
      id: serverPeer.id,
      name: name,
      status: status,
      started: serverPeer.started,
      connected: serverPeer.connected,
      lastCompleted: complete || state.lastCompletedDate,
      error: state.errorMsg ? state : null,
      progress: getPeerProgress(serverPeer.state),
      deviceType: serverPeer.filename ? "file" : serverPeer.deviceType,
    };
  });
}

// We combine media and database items in progress. In order to show roughtly
// accurate progress, this weighting is how much more progress a media item
// counts vs. a database item
const MEDIA_WEIGHTING = 50;
function getPeerProgress(peerState) {
  if (
    !peerState ||
    peerState.topic !== "replication-progress" ||
    !peerState.message ||
    !peerState.message.db ||
    !peerState.message.media
  ) {
    return;
  }
  const total =
    (peerState.message.db.total || 0) +
    (peerState.message.media.total || 0) * MEDIA_WEIGHTING;
  const sofar =
    (peerState.message.db.sofar || 0) +
    (peerState.message.media.sofar || 0) * MEDIA_WEIGHTING;
  const progress = total > 0 ? sofar / total : 0;
  // Round progress to 2-decimal places. PeerItem is memoized, so it will not
  // update if progress does not change. Without rounding PeerItem updates
  // unnecessarily on every progress change, when we are only showing the user a
  // rounded percentage progress. Increase this to 3-decimal places if you want
  // to show more detail to the user.
  return Math.round(progress * 100) / 100;
  /*
    mediaSofar: peerState.message.media.sofar || 0,
    mediaTotal: peerState.message.media.total || 0,
    dbSofar: peerState.message.db.sofar || 0,
    dbTotal: peerState.message.db.total || 0
  }
  */
}

export function parseVersionMajor(versionString = "") {
  const major = Number.parseInt(versionString.split(".")[0]);
  return isNaN(major) ? 0 : major;
}
