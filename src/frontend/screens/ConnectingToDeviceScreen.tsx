import * as React from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { useNavigation } from "react-navigation-hooks";
import Text from "../sharedComponents/Text";

const m = defineMessages({
  title: {
    id: "screens.AddToProjectScreen.ConnectStep.title",
    defaultMessage: "Connecting to device...",
  },
});

export const ConnectingToDeviceScreen: NavigationStackScreenComponent = () => {
  const taskStarted = React.useRef(false);

  const navigation = useNavigation();

  const task = navigation.getParam("task");

  React.useEffect(() => {
    const startTask = async () => {
      if (!taskStarted.current && task) {
        taskStarted.current = true;

        await task();
      }
    };

    startTask();
  }, [task]);

  React.useEffect(() => {
    const disableBack = () => true;

    BackHandler.addEventListener("hardwareBackPress", disableBack);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", disableBack);
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, styles.centeredText]}>
          <FormattedMessage {...m.title} />
        </Text>
      </View>
    </View>
  );
};

ConnectingToDeviceScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  centeredText: {
    textAlign: "center",
  },
});
