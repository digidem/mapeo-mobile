import * as React from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import Text from "../sharedComponents/Text";
import { useSetHeader } from "../hooks/useSetHeader";
import { NativeNavigationProp } from "../sharedTypes";

const m = defineMessages({
  title: {
    id: "screens.AddToProjectScreen.ConnectStep.title",
    defaultMessage: "Connecting to device...",
  },
});

export const ConnectingToDeviceScreen = ({
  route,
}: NativeNavigationProp<"ConnectingToDeviceScreen">) => {
  const taskStarted = React.useRef(false);

  useSetHeader({ headerShown: false });

  const task = route.params.task;

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
