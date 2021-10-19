import * as React from "react";
import { BackHandler, useWindowDimensions } from "react-native";
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Backdrop } from "./Backdrop";

const MIN_SHEET_HEIGHT = 400;

export const MODAL_NAVIGATION_OPTIONS = {
  cardStyle: { backgroundColor: "transparent" },
  animationEnabled: false,
};

export const useBottomSheetModal = ({
  openOnMount,
}: {
  openOnMount: boolean;
}) => {
  const initiallyOpenedRef = React.useRef(false);
  const sheetRef = React.useRef<RNBottomSheetModal>(null);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.dismiss();
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return { sheetRef, closeSheet, openSheet };
};

const useBackPressHandler = (onHardwareBackPress?: () => void) => {
  React.useEffect(() => {
    const onBack = () => {
      if (onHardwareBackPress) {
        onHardwareBackPress();
      }

      // We don't allow the back press to navigate/dismiss this modal by default
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBack);

    return () => BackHandler.removeEventListener("hardwareBackPress", onBack);
  }, [onHardwareBackPress]);
};

const useSnapPointsCalculator = () => {
  const [sheetHeight, setSheetHeight] = React.useState(0);

  const { height: windowHeight } = useWindowDimensions();

  const snapPoints = React.useMemo(() => [sheetHeight], [sheetHeight]);

  const updateSheetHeight = React.useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      const newSheetHeight = Math.max(
        Math.min(windowHeight * 0.75, height),
        MIN_SHEET_HEIGHT
      );

      setSheetHeight(newSheetHeight);
    },
    [windowHeight]
  );

  return { snapPoints, updateSheetHeight };
};

interface Props extends React.PropsWithChildren<{}> {
  onDismiss: () => void;
  onHardwareBackPress?: () => void;
  snapPoints?: (string | number)[];
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({ children, onDismiss, onHardwareBackPress }, ref) => {
    useBackPressHandler(onHardwareBackPress);

    const { snapPoints, updateSheetHeight } = useSnapPointsCalculator();

    return (
      <BottomSheetModalProvider>
        <RNBottomSheetModal
          ref={ref}
          backdropComponent={Backdrop}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          handleComponent={() => null}
          index={0}
          onDismiss={onDismiss}
          snapPoints={snapPoints}
        >
          <BottomSheetView
            onLayout={updateSheetHeight}
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 30,
            }}
          >
            {children}
          </BottomSheetView>
        </RNBottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

export { Content as BottomSheetContent } from "./Content";