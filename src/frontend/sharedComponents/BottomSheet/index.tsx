import * as React from "react";
import { BackHandler } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import Backdrop from "./Backdrop";

const SNAP_POINTS = [400];

interface Props extends React.PropsWithChildren<{}> {
  onHardwareBackPress?: () => void;
  onDismiss: () => void;
}

const BottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ children, onHardwareBackPress, onDismiss }, ref) => {
    React.useEffect(() => {
      const onBack = () => {
        if (onHardwareBackPress) {
          onHardwareBackPress();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBack);

      return () => BackHandler.removeEventListener("hardwareBackPress", onBack);
    }, [onHardwareBackPress]);

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          index={0}
          ref={ref}
          snapPoints={SNAP_POINTS}
          backdropComponent={Backdrop}
          onDismiss={onDismiss}
        >
          {children}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

export default BottomSheet;
