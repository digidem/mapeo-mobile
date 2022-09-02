import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { devExperiments } from "../../lib/DevExperiments";
import { NativeNavigationComponent } from "../../sharedTypes";
import { SecurityContext } from "../Security/SecurityContext";
import { EnterPasscode } from "./EnterPasscode";
import { NewPasscode } from "./NewPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export const AppPasscode: NativeNavigationComponent<"AppPasscode"> = ({
  navigation,
}) => {
  const { passIsSet } = React.useContext(SecurityContext);
  const { appPasscode } = devExperiments;

  React.useEffect(() => {
    if (!appPasscode) navigation.navigate("Settings");
  }, [appPasscode]);

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      {!passIsSet ? <NewPasscode /> : <EnterPasscode />}
    </ScrollView>
  );
};

AppPasscode.navTitle = m.title;

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
