// @flow
import React from "react";
// import { Picker as OriginalPicker } from "@react-native-community/picker";
import { FormattedMessage, defineMessages } from "react-intl";
import { useNavigation } from "react-navigation-hooks";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "../../sharedComponents/List";

const m = defineMessages({
  settingsTitle: {
    id: "screens.Settings.title",
    defaultMessage: "Settings",
    description: "Title of settings screen"
  },
  language: {
    id: "screens.Settings.language",
    defaultMessage: "Language",
    description: "Primary text for language settings"
  },
  languageDesc: {
    id: "screens.Settings.languageDesc",
    defaultMessage: "Display language for App",
    description: "Secondary text for language settings"
  },
  projectConfig: {
    id: "screens.Settings.projectConfig",
    defaultMessage: "Project Configuration",
    description: "Primary text for project config settings"
  },
  projectConfigDesc: {
    id: "screens.Settings.projectConfigDesc",
    defaultMessage: "Categories, icons and questions",
    description: "Secondary text for project config settings"
  }
});

const Settings = () => {
  const { navigate } = useNavigation();
  return (
    <List>
      <ListItem onPress={() => navigate("LanguageSettings")}>
        <ListItemIcon iconName="language" />
        <ListItemText
          primary={<FormattedMessage {...m.language} />}
          secondary={<FormattedMessage {...m.languageDesc} />}></ListItemText>
      </ListItem>
      <ListItem onPress={() => navigate("ProjectConfig")}>
        <ListItemIcon iconName="assignment" />
        <ListItemText
          primary={<FormattedMessage {...m.projectConfig} />}
          secondary={
            <FormattedMessage {...m.projectConfigDesc} />
          }></ListItemText>
      </ListItem>
    </List>
  );
};

Settings.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.settingsTitle} />
    </HeaderTitle>
  )
};

export default Settings;
