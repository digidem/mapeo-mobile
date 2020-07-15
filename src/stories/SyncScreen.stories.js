// @flow
import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import SyncView from "../frontend/screens/SyncModal/SyncView";
import { peerStatus } from "../frontend/screens/SyncModal/PeerList";
import Fullscreen from "./Fullscreen";

const peers = [
  {
    id: "0",
    name: "Kevlar",
    status: peerStatus.READY,
    progress: undefined,
    lastCompleted: undefined,
    error: undefined,
    connected: true
  },
  {
    id: "10",
    name: "Kashint",
    status: peerStatus.PROGRESS,
    progress: undefined,
    lastCompleted: Date.now(),
    error: undefined,
    deviceType: "desktop",
    connected: true
  },
  {
    id: "1",
    name: "Nunchuck",
    status: peerStatus.PROGRESS,
    progress: 0.2,
    lastCompleted: Date.now() - 60 * 60 * 1000,
    error: undefined,
    deviceType: "desktop",
    connected: true
  },
  {
    id: "2",
    name: "Kama",
    status: peerStatus.COMPLETE,
    progress: undefined,
    lastCompleted: Date.now() - 2 * 24 * 60 * 60 * 1000,
    error: undefined,
    connected: true
  },
  {
    id: "3",
    name: "Really long device name here",
    status: peerStatus.ERROR,
    progress: undefined,
    lastCompleted: undefined,
    error: undefined,
    connected: false
  }
];

storiesOf("SyncScreen", module)
  .addDecorator(storyFn => <Fullscreen>{storyFn()}</Fullscreen>)
  .add("No Wifi connection", () => (
    <SyncView
      peers={[]}
      deviceName="My Android Device"
      ssid={null}
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ))
  .add("With Wifi, searching", () => (
    <SyncView
      peers={[]}
      deviceName="My Android Device"
      ssid="My Wifi Network"
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ))
  .add("With Peers", () => (
    <SyncView
      peers={peers.concat(
        peers.map(peer => ({ ...peer, id: peer.id + peer.id }))
      )}
      deviceName="My Android Device"
      ssid="My Wifi Network"
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ));
