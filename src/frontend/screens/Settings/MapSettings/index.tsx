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
  mapSettings: {
    id: "screens.Settings.MapSettings.mapSettings",
    defaultMessage: "Map Settings",
  },
  subtitle: {
    id: "screens.Settings.MapSettings.subtitle",
    defaultMessage: "Add, remove, and view map details",
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
            secondary={<FormattedMessage {...m.subtitle} />}
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

MapSettings.navTitle = m.mapSettings;
