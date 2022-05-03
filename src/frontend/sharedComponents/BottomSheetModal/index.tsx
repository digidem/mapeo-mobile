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
  const isOpen = React.useRef<boolean>(false);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.dismiss();
      isOpen.current = false;
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
      isOpen.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return { sheetRef, closeSheet, openSheet, isOpen: isOpen.current };
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
  //Having a value of 0 caused a flickering of the backdrop whenever the sheet was initially opened. This only occurs when the component is used within a component (as opposed to a standalone navigation screen). Switching it to a positive number causes the onLayout event in the content to report an inaccurate height value, which causes the sheet size to be miscalculated, affecting the content within the sheet (e.g. squishing, overflow, etc).
  const [sheetHeight, setSheetHeight] = React.useState(-1);

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
  disableBackrop?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  ({ children, onDismiss, onHardwareBackPress, disableBackrop }, ref) => {
    useBackPressHandler(onHardwareBackPress);

    const { snapPoints, updateSheetHeight } = useSnapPointsCalculator();

    return (
      <BottomSheetModalProvider>
        <RNBottomSheetModal
          ref={ref}
          backdropComponent={disableBackrop ? null : Backdrop}
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
