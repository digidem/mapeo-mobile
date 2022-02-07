// @flow
import React, { useContext } from "react";
// import { Picker as OriginalPicker } from "@react-native-community/picker";
import { FormattedMessage, defineMessages } from "react-intl";
import { useNavigation } from "react-navigation-hooks";
import SettingsContext from "../../context/SettingsContext";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../sharedComponents/List";

const m = defineMessages({
  settingsTitle: {
    id: "screens.Settings.title",
    defaultMessage: "Settings",
    description: "Title of settings screen",
  },
  language: {
    id: "screens.Settings.language",
    defaultMessage: "Language",
    description: "Primary text for language settings",
  },
  languageDesc: {
    id: "screens.Settings.languageDesc",
    defaultMessage: "Display language for App",
    description: "Secondary text for language settings",
  },
  projectConfig: {
    id: "screens.Settings.projectConfig",
    defaultMessage: "Project Configuration",
    description: "Primary text for project config settings",
  },
  projectConfigDesc: {
    id: "screens.Settings.projectConfigDesc",
    defaultMessage: "Categories, icons and questions",
    description: "Secondary text for project config settings",
  },
  aboutMapeo: {
    id: "screens.Settings.aboutMapeo",
    defaultMessage: "About Mapeo",
    description: "Primary text for 'About Mapeo' link (version info)",
  },
  aboutMapeoDesc: {
    id: "screens.Settings.aboutMapeoDesc",
    defaultMessage: "Version and build number",
    description: "Description of the 'About Mapeo' page",
  },
  appShare: {
    id: "screens.Settings.appShare",
    defaultMessage: "Share Mapeo Installer",
    description: "Primary text for sharing the mapeo APK installer",
  },
  appShareDesc: {
    id: "screens.Settings.appShareDesc",
    defaultMessage: "Install or update Mapeo on another phone",
    description: "Secondary text for sharing the mapeo APK installer",
  },
  appInstall: {
    id: "screens.Settings.appInstall",
    defaultMessage: "Install APK",
    description: "Primary text for Mapeo APK test",
  },
  appInstallDesc: {
    id: "screens.Settings.appInstallDesc",
    defaultMessage: "Test APK install (re-installs app)",
    description: "Secondary text for Mapeo APK test",
  },
  coordinateFormat: {
    id: "screens.Settings.coordinateFormat",
    defaultMessage: "Coordinate Format",
    description: "Settings for coordinate format",
  },
  coordinateFormatDesc: {
    id: "screens.Settings.coordinateFormatDesc",
    defaultMessage: "Choose how coordinates are displayed",
    description: "Description of the 'Coordinate Format' page",
  },
  experiments: {
    id: "screens.Settings.experiments",
    defaultMessage: "Experiments",
    description: "Experimental features",
  },
  experimentsDesc: {
    id: "screens.Settings.experimentsDesc",
    defaultMessage: "Turn on experimental new features",
    description: "Description of the 'Experiment' page",
  },
  security: {
    id: "screens.Settings.security",
    defaultMessage: "Security",
  },
  securityDesc: {
    id: "screens.Settings.securityDesc",
    defaultMessage: "App Passcode and Device Security",
    description: "Description of security button in settings",
  },
  mapSettings: {
    id: "screens.Settings.mapSettings",
    defaultMessage: "Map Settings",
    description: "Button to adjust settings for map",
  },
});

const Settings = () => {
  const { navigate } = useNavigation();
  const [{ experiments }] = useContext(SettingsContext);

  return (
    <List testID="settingsList">
      <ListItem
        onPress={() => navigate("LanguageSettings")}
        testID="settingsLanguageButton"
      >
        <ListItemIcon iconName="language" />
        <ListItemText
          primary={<FormattedMessage {...m.language} />}
          secondary={<FormattedMessage {...m.languageDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem
        onPress={() => navigate("ProjectConfig")}
        testID="settingsProjectConfigButton"
      >
        <ListItemIcon iconName="assignment" />
        <ListItemText
          primary={<FormattedMessage {...m.projectConfig} />}
          secondary={<FormattedMessage {...m.projectConfigDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem
        onPress={() => navigate("MapSettings")}
        testID="settingsMapSettingsButton"
      >
        <ListItemIcon iconName="map" />
        <ListItemText
          primary={<FormattedMessage {...m.mapSettings} />}
          secondary="---------"
        />
      </ListItem>

      <ListItem
        onPress={() => navigate("CoordinateFormat")}
        testID="settingsCoodinatesButton"
      >
        <ListItemIcon iconName="explore" />
        <ListItemText
          primary={<FormattedMessage {...m.coordinateFormat} />}
          secondary={<FormattedMessage {...m.coordinateFormatDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem
        onPress={() => navigate("AboutMapeo")}
        testID="settingsAboutButton"
      >
        <ListItemIcon iconName="info-outline" />
        <ListItemText
          primary={<FormattedMessage {...m.aboutMapeo} />}
          secondary={<FormattedMessage {...m.aboutMapeoDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem
        onPress={() => navigate("EnterPassword")}
        testID="settingsExperimentButton"
      >
        <ListItemIcon iconName="flag" />
        <ListItemText
          primary={<FormattedMessage {...m.experiments} />}
          secondary={<FormattedMessage {...m.experimentsDesc} />}
        ></ListItemText>
      </ListItem>

      {experiments.appPasscode && (
        <ListItem onPress={() => navigate("Security")}>
          <ListItemIcon iconName="security" />
          <ListItemText
            primary={<FormattedMessage {...m.security} />}
            secondary={<FormattedMessage {...m.securityDesc} />}
          ></ListItemText>
        </ListItem>
      )}
    </List>
  );
};

Settings.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.settingsTitle} />
    </HeaderTitle>
  ),
};

export default Settings;
