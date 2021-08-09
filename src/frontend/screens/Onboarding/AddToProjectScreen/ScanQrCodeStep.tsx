import * as React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Camera, CameraMountError } from "expo-camera";
import { FormattedMessage, defineMessages } from "react-intl";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";

import bugsnag from "../../../lib/logger";
import { BLACK, WHITE } from "../../../lib/styles";
import Loading from "../../../sharedComponents/Loading";
import Text from "../../../sharedComponents/Text";

const MAX_SCANNER_HEIGHT = 350;

const reportMountError = (error: CameraMountError) => {
  bugsnag.notify(new Error(error.message));
};

const m = defineMessages({
  title: {
    id:
      "screens.Onboarding.AddToProjectScreen.ScanQrCodeStep.instructionsTitle",
    defaultMessage: "Instructions",
  },
  instructionsDescription: {
    id:
      "screens.Onboarding.AddToProjectScreen.ScanQrCodeStep.instructionsDescription",
    defaultMessage: "Scan device to add person to project",
  },
  havingTroubleTitle: {
    id: "screens.Onboarding.AddToProjectScreen.ScanQrCodeStep.havingTrouble",
    defaultMessage: "Having trouble?",
  },
  havingTroubleDescription: {
    id:
      "screens.Onboarding.AddToProjectScreen.ScanQrCodeStep.havingTroubleDescription",
    defaultMessage: "Ask community Mapper to send join request",
  },
});

interface Props {
  goNext: (data: string) => void;
}

export const ScanQrCodeStep = ({ goNext }: Props) => {
  const [cameraReady, setCameraReady] = React.useState(false);
  const [scanDisabled, setScanDisabled] = React.useState(false);
  const [data, setData] = React.useState<string>();

  const { width } = useWindowDimensions();
  const scannerWidth = Math.min(width - 80, MAX_SCANNER_HEIGHT);

  const onScanned = ({ data }: BarCodeScannerResult) => {
    setScanDisabled(true);
    // TODO: Do stuff to get added device info
    setData("abc123");
  };

  // TODO: Most likely temporary but helpful to make transitions less abrupt
  React.useEffect(() => {
    if (data) {
      setTimeout(() => goNext(data), 1000);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.scannerContainer,
          {
            width: scannerWidth,
            height: scannerWidth,
          },
        ]}
      >
        {!cameraReady && <Loading />}

        <Camera
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={
            cameraReady && !scanDisabled ? onScanned : undefined
          }
          onCameraReady={() => setCameraReady(true)}
          onMountError={reportMountError}
          style={[
            styles.camera,
            {
              display: cameraReady ? undefined : "none",
            },
          ]}
          type={Camera.Constants.Type.back}
          useCamera2Api={false}
        >
          {!!data && (
            <View style={styles.processingContainer}>
              <Loading />
            </View>
          )}
        </Camera>
      </View>

      <View>
        <View>
          <View style={styles.scannerInstructionsContainer}>
            <Text style={[styles.title, styles.centeredText]}>
              <FormattedMessage {...m.title} />
            </Text>
            <Text style={[styles.description]}>
              <FormattedMessage {...m.instructionsDescription} />
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={[styles.description, styles.italic, styles.centeredText]}
          >
            <FormattedMessage {...m.havingTroubleTitle} />
          </Text>
          <Text style={[styles.description]}>
            <FormattedMessage {...m.havingTroubleDescription} />
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  scannerInstructionsContainer: {
    margin: 20,
  },
  scannerContainer: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: BLACK,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  processingContainer: {
    width: "100%",
    height: "100%",
    opacity: 0.4,
    backgroundColor: WHITE,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
  },
  italic: {
    fontStyle: "italic",
  },
  centeredText: {
    textAlign: "center",
  },
});
