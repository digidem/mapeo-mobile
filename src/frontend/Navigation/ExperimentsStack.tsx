import * as React from "react";
import { createAppContainer } from "react-navigation";
import { AppStackMap, stackNavConfig } from "./AppStack";
import { MapSettings } from "../screens/Settings/MapSettings";
import { BackgroundMaps } from "../screens/Settings/MapSettings/BackgroundMaps";
import { OfflineAreas } from "../screens/Settings/MapSettings/OfflineAreas";
import { createStackNavigator } from "react-navigation-stack";

const ExperimentStack = createStackNavigator(
  {
    ...AppStackMap,
    MapSettings,
    BackgroundMaps,
    OfflineAreas,
  },
  stackNavConfig
);

export const ExperimentsContainer = createAppContainer(ExperimentStack);
