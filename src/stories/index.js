import React from "react";

import { storiesOf } from "@storybook/react-native";
import { linkTo } from "@storybook/addon-links";

import "./SyncScreen.stories";
import "./ObservationsList.stories";
import "./ObservationEdit.stories";
import Welcome from "./Welcome";

global.Symbol = require("core-js/es6/symbol");
require("core-js/fn/symbol/iterator");
require("core-js/fn/map");
require("core-js/fn/set");
require("core-js/fn/array/find");

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("ObservationsList")} />
));
