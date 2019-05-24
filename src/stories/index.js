import React from "react";

import { storiesOf } from "@storybook/react-native";
import { linkTo } from "@storybook/addon-links";

import "./SyncScreen.stories";
import "./ObservationsList.stories";
import "./ObservationEdit.stories";
import Welcome from "./Welcome";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("ObservationsList")} />
));
