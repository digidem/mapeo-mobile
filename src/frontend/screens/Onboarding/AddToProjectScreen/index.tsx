import * as React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";

import ConfigContext from "../../../context/ConfigContext";
import { MEDIUM_BLUE, WHITE } from "../../../lib/styles";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import { BackIcon } from "../../../sharedComponents/icons";
import IconButton from "../../../sharedComponents/IconButton";
import { WithWifiBar } from "../WithWifiBar";

import { ScanQrCodeStep } from "./ScanQrCodeStep";
import { DeviceFoundStep } from "./DeviceFoundStep";
import { SuccessStep } from "./SuccessStep";

type Step = "scan" | "found" | "success";

const m = defineMessages({
  titleGeneric: {
    id: "screens.Onboarding.AddToProjectScreen.titleGeneric",
    defaultMessage: "Add to Project",
  },
});

export const AddToProjectScreen: NavigationStackScreenComponent = () => {
  const [screenLoaded, setScreenLoaded] = React.useState(false);
  const [step, setStep] = React.useState<Step>("scan");
  const [foundDeviceId, setFoundDeviceId] = React.useState<string>();
  const [config] = React.useContext(ConfigContext);

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
              goNext={() => setStep("success")}
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
                setStep("scan");
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
