// @flow
import React from "react";
// import { Picker as OriginalPicker } from "@react-native-community/picker";
import { FormattedMessage, defineMessages } from "react-intl";
import { useNavigation, useFocusEffect } from "react-navigation-hooks";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { version as APP_VERSION } from "../../../../package.json";

import ApkInstaller from "../../lib/ApkInstaller";
import AppInfo from "../../lib/AppInfo";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../sharedComponents/List";
import { StyleSheet, View, ActivityIndicator } from "react-native";

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
});

const Settings = () => {
  const { navigate } = useNavigation();
  const [status, setStatus] = React.useState("idle");
  const didNavigateAway = React.useRef(false);

  const shareApk = React.useCallback(async () => {
    const tmpDir = RNFS.DocumentDirectoryPath + "/installer";
    const apkName = `Mapeo-v${APP_VERSION}.apk`;
    const tmpApkPath = `${tmpDir}/${apkName}`;
    setStatus("loading");
    try {
      // The apk cannot be shared with other apps from the sourceDir folder, so
      // we need to create a copy in a place that can be shared. We delete the
      // copy afterwards
      await RNFS.mkdir(tmpDir);
      await RNFS.copyFile(AppInfo.sourceDir, tmpApkPath);
      if (!didNavigateAway.current) {
        await Share.open({
          url: "file://" + tmpApkPath,
          type: "application/vnd.android.package-archive",
          failOnCancel: false,
        });
      }
    } catch (e) {
      console.error("Error sharing APK", e);
    } finally {
      await RNFS.unlink(tmpDir);
      setStatus("idle");
    }
  }, []);

  const installApk = React.useCallback(async () => {
    const tmpDir = RNFS.DocumentDirectoryPath + "/installer";
    const apkName = `Mapeo-v${APP_VERSION}.apk`;
    const tmpApkPath = `${tmpDir}/${apkName}`;
    setStatus("loading");
    try {
      await RNFS.mkdir(tmpDir);
      await RNFS.copyFile(AppInfo.sourceDir, tmpApkPath);
      if (!didNavigateAway.current) {
        await ApkInstaller.install(tmpApkPath);
      }
    } catch (e) {
      if (e.code !== "E_INSTALL_CANCELLED") {
        console.error("Error installing APK", e);
      }
    } finally {
      // Need to cleanup on app startup, because the app will reach here as soon
      // as install launches, so if we cleanup the file will not exist when the
      // installer tries to install it. We cannot get the result of the install
      // activity because we launch it as a new task:
      // https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK
      // If we don't launch it as a new task, the install will fail as the app
      // itself updates and quits the child install activity
      setStatus("idle");
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      didNavigateAway.current = false;
      return () => (didNavigateAway.current = true);
    }, [])
  );

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
      <ListItem onPress={shareApk}>
        <ListItemIcon iconName="get-app" />
        <ListItemText
          primary={<FormattedMessage {...m.appShare} />}
          secondary={<FormattedMessage {...m.appShareDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem onPress={shareApk}>
        <ListItemIcon iconName="get-app" />
        <ListItemText
          primary={<FormattedMessage {...m.appShare} />}
          secondary={<FormattedMessage {...m.appShareDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem onPress={installApk}>
        <ListItemIcon iconName="update" />
        <ListItemText
          primary={<FormattedMessage {...m.appInstall} />}
          secondary={<FormattedMessage {...m.appInstallDesc} />}
        ></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon iconName="info" />
        <ListItemText
          primary="Mapeo Version"
          secondary={`${APP_VERSION}`}
        ></ListItemText>
      </ListItem>
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
