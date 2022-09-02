import * as React from "react";
import { View, StyleSheet } from "react-native";
import { defineMessages } from "react-intl";

import ConfigContext from "../../context/ConfigContext";
import { MEDIUM_BLUE } from "../../lib/styles";

// TODO: Make this a shared component instead?
import { WithWifiBar } from "../Onboarding/WithWifiBar";

import { DeviceFoundStep } from "./DeviceFoundStep";
import { ScanQrCodeStep } from "./ScanQrCodeStep";
import { SuccessStep } from "./SuccessStep";
import {
  NativeNavigationComponent,
  NativeRootNavigationProps,
} from "../../sharedTypes";
import { useFocusEffect } from "@react-navigation/native";

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

export const AddToProjectScreen: NativeNavigationComponent<"AddToProjectScreen"> = ({
  navigation,
}: NativeRootNavigationProps<"AddToProjectScreen">) => {
  const [screenLoaded, setScreenLoaded] = React.useState(false);
  const [step, setStep] = React.useState<Step>("scan");
  const [foundDeviceId, setFoundDeviceId] = React.useState<string>();
  const [config] = React.useContext(ConfigContext);

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
                navigation.navigate("Home", { screen: "Map" });
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

AddToProjectScreen.navTitle = m.titleGeneric;
