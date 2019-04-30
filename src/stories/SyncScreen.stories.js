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
    error: undefined
  },
  {
    id: "10",
    name: "Kashint",
    status: peerStatus.PROGRESS,
    progress: undefined,
    lastCompleted: 1556574843306,
    error: undefined,
    deviceType: "desktop"
  },
  {
    id: "1",
    name: "Nunchuck",
    status: peerStatus.PROGRESS,
    progress: 0.2,
    lastCompleted: 1556574843306,
    error: undefined,
    deviceType: "desktop"
  },
  {
    id: "2",
    name: "Kama",
    status: peerStatus.COMPLETE,
    progress: undefined,
    lastCompleted: 1556574843306,
    error: undefined
  },
  {
    id: "3",
    name: "Really long device name here",
    status: peerStatus.ERROR,
    progress: undefined,
    lastCompleted: undefined,
    error: undefined
  }
];

storiesOf("SyncScreen", module)
  .addDecorator(storyFn => <Fullscreen>{storyFn()}</Fullscreen>)
  .add("No Wifi connection", () => (
    <SyncView
      peers={[]}
      wifi={null}
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ))
  .add("With Wifi, searching", () => (
    <SyncView
      peers={[]}
      wifi="My Wifi Network"
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ))
  .add("With Peers", () => (
    <SyncView
      peers={peers.concat(peers)}
      wifi="My Wifi Network"
      onClosePress={action("close")}
      onSyncPress={action("sync")}
      onWifiPress={action("goto wifi settings")}
    />
  ));
