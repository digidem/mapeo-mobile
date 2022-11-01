import * as React from "react";
import { useWindowDimensions } from "react-native";
export { Content as BottomSheetContent } from "./Content";

// TODO: Replace the one defined in BottomSheetModal/index.tsx with this one
// Only reason we can't for now is because of some subtle bug with the sheetHeight initial value and how it affects the backdrop in the consuming bottom sheet
export function useSnapPointsCalculator(minHeight: number) {
  const [sheetHeight, setSheetHeight] = React.useState(0);

  const { height: windowHeight } = useWindowDimensions();

  const snapPoints = React.useMemo(() => [0, sheetHeight], [sheetHeight]);

  const updateSheetHeight = React.useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      const newSheetHeight = Math.max(
        Math.min(windowHeight * 0.75, height),
        minHeight
      );

      setSheetHeight(newSheetHeight);
    },
    [windowHeight, minHeight]
  );

  return { snapPoints, updateSheetHeight };
}
