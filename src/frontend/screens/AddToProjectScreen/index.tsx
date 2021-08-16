import * as React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";

import ConfigContext from "../../context/ConfigContext";
import { MEDIUM_BLUE, WHITE } from "../../lib/styles";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { BackIcon } from "../../sharedComponents/icons";
import IconButton from "../../sharedComponents/IconButton";
// TODO: Make this a shared component instead?
import { WithWifiBar } from "../Onboarding/WithWifiBar";

import { DeviceFoundStep } from "./DeviceFoundStep";
import { ScanQrCodeStep } from "./ScanQrCodeStep";
import { SuccessStep } from "./SuccessStep";

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

export const AddToProjectScreen: NavigationStackScreenComponent = () => {
  const navigation = useNavigation();

  const [screenLoaded, setScreenLoaded] = React.useState(false);
  const [step, setStep] = React.useState<Step>("scan");
  const [foundDeviceId, setFoundDeviceId] = React.useState<string>();
  const [config] = React.useContext(ConfigContext);

  const sendInvite = async (deviceId: string) =>
    navigation.navigate("ConnectingToDevice", {
      task: async () => {
        try {
          await sendInviteToDevice(deviceId);
          navigation.navigate("AddToProject");
          setStep("success");
        } catch (err) {
          navigation.navigate("AddToProject");
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
      <NavigationEvents
        onDidFocus={() => {
          if (!screenLoaded) {
            setScreenLoaded(true);
          }
        }}
      />
      <View style={styles.container}>{getRenderedStep()}</View>
    </WithWifiBar>
  );
};

AddToProjectScreen.navigationOptions = () => ({
  // TODO: Get the project name and add it to the title here
  headerTitle: () => (
    <HeaderTitle style={{ color: WHITE }}>
      <FormattedMessage {...m.titleGeneric} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon color={WHITE} />
      </IconButton>
    ),
  headerStyle: {
    backgroundColor: MEDIUM_BLUE,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
