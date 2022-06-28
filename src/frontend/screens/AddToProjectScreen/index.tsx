import * as React from "react";
import { View, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import ConfigContext from "../../context/ConfigContext";
import { MEDIUM_BLUE, WHITE } from "../../lib/styles";
import { BackIcon } from "../../sharedComponents/icons";
import IconButton from "../../sharedComponents/IconButton";

// TODO: Make this a shared component instead?
import { WithWifiBar } from "../Onboarding/WithWifiBar";

import { DeviceFoundStep } from "./DeviceFoundStep";
import { ScanQrCodeStep } from "./ScanQrCodeStep";
import { SuccessStep } from "./SuccessStep";
import { NativeNavigationProp } from "../../sharedTypes";
import { useFocusEffect } from "@react-navigation/native";
import { useSetHeader } from "../../hooks/useSetHeader";

type Step = "scan" | "found" | "success";

const m = defineMessages({
  titleGeneric: {
    id: "screens.AddToProjectScreen.titleGeneric",
    defaultMessage: "Add to Project",
  },
});

// TODO: This will make some API call and wait for a response from the invited device
// Resolve if accepted, reject if declined?
const sendInviteToDevice = (deviceId: string) =>
  new Promise((res, rej) => {
    setTimeout(res, 2000);
  });

export const AddToProjectScreen = ({
  navigation,
}: NativeNavigationProp<"AddToProjectScreen">) => {
  const [screenLoaded, setScreenLoaded] = React.useState(false);
  const [step, setStep] = React.useState<Step>("scan");
  const [foundDeviceId, setFoundDeviceId] = React.useState<string>();
  const [config] = React.useContext(ConfigContext);

  useSetHeader({
    headerTitle: m.titleGeneric,
    headerLeft: prop => (
      <IconButton onPress={prop.onPress || navigation.goBack}>
        <BackIcon color={WHITE} />
      </IconButton>
    ),
    backgroundColor: MEDIUM_BLUE,
  });

  useFocusEffect(() => {
    setScreenLoaded(true);
  });

  const sendInvite = async (deviceId: string) =>
    navigation.navigate("ConnectingToDeviceScreen", {
      task: async () => {
        try {
          await sendInviteToDevice(deviceId);
          navigation.navigate("AddToProjectScreen");
          setStep("success");
        } catch (err) {
          navigation.navigate("AddToProjectScreen");
        }
      },
    });

  const getRenderedStep = () => {
    switch (step) {
      case "scan":
        return (
          <ScanQrCodeStep
            goNext={data => {
              setFoundDeviceId(data);
              setStep("found");
            }}
            screenLoaded={screenLoaded}
          />
        );
      case "found":
        return (
          !!foundDeviceId && (
            <DeviceFoundStep
              deviceId={foundDeviceId}
              goNext={() => sendInvite(foundDeviceId)}
              goBack={() => {
                setFoundDeviceId(undefined);
                setStep("scan");
              }}
            />
          )
        );
      case "success":
        return (
          !!foundDeviceId &&
          !!config.metadata.name && (
            <SuccessStep
              goNext={() => {
                setFoundDeviceId(undefined);
                // TODO: Need to go to a sync screen instead
                navigation.navigate("Home");
              }}
              deviceId={foundDeviceId}
              projectName={config.metadata.name}
            />
          )
        );
    }
  };

  return (
    <WithWifiBar>
      <View style={styles.container}>{getRenderedStep()}</View>
    </WithWifiBar>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
