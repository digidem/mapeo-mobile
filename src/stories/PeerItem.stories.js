import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import { PeerItem } from "../frontend/screens/SyncModal/PeerList";
import { peerStatus } from "../frontend/screens/SyncModal";

storiesOf("PeerItem", module).add("default", () => (
  <PeerItem
    id="peerID"
    name="My Laptop"
    status={peerStatus.PROGRESS}
    progress={0.5}
    onSyncPress={action("sync")}
  />
));
