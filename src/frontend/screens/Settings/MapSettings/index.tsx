import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { ScrollView } from "react-native";
import { List, ListItem, ListItemText } from "../../../sharedComponents/List";
import { NativeNavigationComponent } from "../../../sharedTypes";

const m = defineMessages({
  backgroundMaps: {
    id: "screens.Settings.MapSettings.backgroundMaps",
    defaultMessage: "Background Maps",
  },
  dataLayers: {
    id: "screens.Settings.MapSettings.dataLayers",
    defaultMessage: "Data Layers",
  },
  mapSettings: {
    id: "screens.Settings.MapSettings.mapSettings",
    defaultMessage: "Map Settings",
  },
});

export const MapSettings: NativeNavigationComponent<"MapSettings"> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  return (
    <ScrollView>
      <List>
        <ListItem
          onPress={() => {
            navigate("BackgroundMaps");
          }}
        >
          <ListItemText
            primary={<FormattedMessage {...m.backgroundMaps} />}
            secondary={"---------"}
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

MapSettings.navTitle = m.mapSettings;
