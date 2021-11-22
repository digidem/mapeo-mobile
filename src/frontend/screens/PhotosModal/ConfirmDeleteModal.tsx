import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import useDraftObservation from "../../hooks/useDraftObservation";

import {
  MODAL_NAVIGATION_OPTIONS,
  BottomSheetModal,
  BottomSheetContent,
  useBottomSheetModal,
} from "../../sharedComponents/BottomSheetModal";
import { NavigationProp } from "../../types";

interface ModalProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  photoIndex: number;
  closeSheet: () => void;
  navigationProp: NavigationProp;
}

export const ConfirmDeleteModal = ({
  sheetRef,
  photoIndex,
  closeSheet,
  navigationProp,
}: ModalProps) => {
  const [{}, { deletePhoto }] = useDraftObservation();

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={closeSheet}>
      <BottomSheetContent
        buttonConfigs={[
          {
            variation: "outlined",
            onPress: closeSheet,
            text: "Cancel",
          },
          {
            variation: "filled",
            onPress: () => {
              deletePhoto(photoIndex);
              closeSheet();
              navigationProp.pop();
            },
            text: "Yes, Delete",
          },
        ]}
        title="Do you want to delete your photo?"
      />
    </BottomSheetModal>
  );
};
