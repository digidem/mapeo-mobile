import * as React from "react";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { View, StyleSheet } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";

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
  title: {
    id: "screens.Onboarding.AddToProjectScreen.title",
    defaultMessage: "Add to {projectName}",
  },
});

export const AddToProjectScreen: NavigationStackScreenComponent = () => {
  const [step, setStep] = React.useState<Step>("scan");
  const [foundDeviceId, setFoundDeviceId] = React.useState<string>();

  // TODO: Get the actual project name here
  const projectName = "BarFoo";

  const getRenderedStep = () => {
    switch (step) {
      case "scan":
        return (
          <ScanQrCodeStep
            goNext={data => {
              setFoundDeviceId(data);
              setStep("found");
            }}
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
          !!foundDeviceId && (
            <SuccessStep
              goNext={() => {
                setFoundDeviceId(undefined);
                setStep("scan");
              }}
              deviceId={foundDeviceId}
              projectName={projectName}
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

AddToProjectScreen.navigationOptions = () => ({
  animationEnabled: false,
  headerTitle: () => (
    <HeaderTitle style={{ color: WHITE }}>
      {/* TODO: Get the actual project name here */}
      <FormattedMessage {...m.title} values={{ projectName: "BarFoo" }} />
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
