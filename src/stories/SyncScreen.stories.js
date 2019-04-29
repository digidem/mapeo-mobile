// @flow
import React from "react";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import SyncView from "../frontend/screens/SyncModal/SyncView";

storiesOf("SyncScreen", module).add("No Wifi connection", () => (
  <SyncView
    peers={[]}
    name="My Laptop"
    wifi={null}
    onClosePress={action("close")}
    onSyncPress={action("sync")}
  />
));
