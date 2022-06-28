import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "react-navigation-hooks";

import { useSetHeader } from "../../hooks/useSetHeader";
import { devExperiments } from "../../lib/DevExperiments";
import { SecurityContext } from "../Security/SecurityContext";
import { EnterPasscode } from "./EnterPasscode";
import { NewPasscode } from "./NewPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export const AppPasscode = () => {
  const { passIsSet } = React.useContext(SecurityContext);
  const { navigate } = useNavigation();
  const { appPasscode } = devExperiments;

  React.useEffect(() => {
    if (!appPasscode) navigate("Settings");
  }, [appPasscode]);

  useSetHeader({ headerTitle: m.title });

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      {!passIsSet ? <NewPasscode /> : <EnterPasscode />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
