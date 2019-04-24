import React from "react";
import { Platform } from "react-native";
import * as Storybook from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

import ObservationsListView from "../frontend/screens/ObservationsList/ObservationsListView";
import { matchPreset } from "../frontend/lib/utils";
import observationsJson from "./test_observations.json";
import presetsJson from "./test_presets.json";

// The web implementation of flatlist is inefficient and blocks browser
// rendering, so we only use 30 list items for web.
const maxListSize =
  Platform.OS === "web" ? 30 : Object.keys(observationsJson).length;

const observations = new Map(
  Object.entries(observationsJson).slice(0, maxListSize)
);
const presets = new Map(Object.entries(presetsJson.presets));
const { storiesOf } = Storybook;

storiesOf("ObservationsList", module).add("default", () => (
  <ObservationsListView
    observations={observations}
    getPreset={o => matchPreset(o, presets)}
    onPressObservation={action("Press list item")}
  />
));
