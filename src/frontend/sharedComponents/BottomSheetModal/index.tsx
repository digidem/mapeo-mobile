import * as React from "react";
import {
  BackHandler,
  NativeEventSubscription,
  useWindowDimensions,
} from "react-native";
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { Backdrop } from "./Backdrop";

const MIN_SHEET_HEIGHT = 400;

export const MODAL_NAVIGATION_OPTIONS: NativeStackNavigationOptions = {
  presentation: "transparentModal",
  animation: "none",
};

export const useBottomSheetModal = ({
  openOnMount,
}: {
  openOnMount: boolean;
}) => {
  const initiallyOpenedRef = React.useRef(false);
  const sheetRef = React.useRef<RNBottomSheetModal>(null);
  const [isOpen, setIsOpen] = React.useState(openOnMount);

  const closeSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.dismiss();
      setIsOpen(false);
    }
  }, []);

  const openSheet = React.useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
      setIsOpen(true);
    }
  }, []);

  React.useEffect(() => {
    if (!initiallyOpenedRef.current && openOnMount) {
      initiallyOpenedRef.current = true;
      openSheet();
    }
  }, [openOnMount, openSheet]);

  return { sheetRef, closeSheet, openSheet, isOpen };
};

// More universal way of preventing navigation back events
// https://reactnavigation.org/docs/preventing-going-back/
function usePreventNavigationBack(enable: boolean) {
  const navigation = useNavigationFromRoot();

  React.useEffect(() => {
    let unsubscribe: () => void;

    if (enable) {
      unsubscribe = navigation.addListener("beforeRemove", event => {
        if (event.data.action.type === "GO_BACK") event.preventDefault();
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [enable]);
}

// Handles cases where Android hardware backpress button is used to trigger navigation events
// not covered by usePreventNavigationBack
const usePreventHardwareBackPressHandler = (
  enable: boolean,
  onHardwareBackPress?: () => void
) => {
  React.useEffect(() => {
    let subscription: NativeEventSubscription;

    if (enable) {
      subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (onHardwareBackPress) {
          onHardwareBackPress();
        }

        return true;
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [enable, onHardwareBackPress]);
};

const useSnapPointsCalculator = () => {
  // Having a value of 0 caused a flickering of the backdrop whenever the sheet was initially opened. This only occurs when the component is used within a component (as opposed to a standalone navigation screen). Switching it to a positive number causes the onLayout event in the content to report an inaccurate height value, which causes the sheet size to be miscalculated, affecting the content within the sheet (e.g. squishing, overflow, etc).
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
  isOpen: boolean;
  onDismiss?: () => void;
  onHardwareBackPress?: () => void;
  snapPoints?: (string | number)[];
  disableBackrop?: boolean;
}

export const BottomSheetModal = React.forwardRef<RNBottomSheetModal, Props>(
  (
    { children, isOpen, onDismiss, onHardwareBackPress, disableBackrop },
    ref
  ) => {
    usePreventNavigationBack(!!isOpen);
    usePreventHardwareBackPressHandler(!!isOpen, onHardwareBackPress);

    const { snapPoints, updateSheetHeight } = useSnapPointsCalculator();

    return (
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
    );
  }
);

export { BottomSheetContent } from "../BottomSheet";
