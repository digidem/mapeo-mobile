import * as React from "react";
import { BackHandler, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { Backdrop } from "./Backdrop";

const DEFAULT_SNAP_POINTS = [400];

interface Props extends React.PropsWithChildren<{}> {
  hideDragHandle?: boolean;
  onHardwareBackPress?: () => void;
  onDismiss: () => void;
  snapPoints?: (string | number)[];
}

export const BottomSheet = React.forwardRef<BottomSheetModal, Props>(
  (
    {
      children,
      hideDragHandle = false,
      onHardwareBackPress,
      onDismiss,
      snapPoints = DEFAULT_SNAP_POINTS,
    },
    ref
  ) => {
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
          snapPoints={snapPoints}
          backdropComponent={Backdrop}
          onDismiss={onDismiss}
          handleComponent={hideDragHandle ? () => null : undefined}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: hideDragHandle ? 30 : 10,
            }}
          >
            {children}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

export { Content as BottomSheetContent } from "./Content";
