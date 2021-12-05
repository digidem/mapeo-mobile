import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useDraftObservation } from "../../hooks/useDraftObservation";

import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../sharedComponents/BottomSheetModal";
import { NavigationProp } from "../../types";

interface ModalProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  photoIndex: number;
  closeSheet: () => void;
  navigationProp: NavigationProp;
}

const m = defineMessages({
  deletePhotoHeader: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoHeader",
    defaultMessage: "Delete this photo?",
  },
  deletePhotoButton: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoButton",
    defaultMessage: "Delete Photo",
  },
  cancel: {
    id: "screens.Photos.ConfirmDeleteModal.cancel",
    defaultMessage: "cancel",
  },
});

export const ConfirmDeleteModal = ({
  sheetRef,
  photoIndex,
  closeSheet,
  navigationProp,
}: ModalProps) => {
  const [{ photos }, { deletePhoto }] = useDraftObservation();
  const { formatMessage: t } = useIntl();

  function photoDelete() {
    const photoToDelete = photos[photoIndex];
    if ("id" in photoToDelete) {
      const photoId = photoToDelete.id;
      deletePhoto(photoId);
      closeSheet();
      navigationProp.pop();
    }
    return;
  }

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={closeSheet}>
      <BottomSheetContent
        buttonConfigs={[
          {
            variation: "filled",
            dangerous: true,
            onPress: photoDelete,
            text: t(m.deletePhotoButton),
          },
          {
            variation: "outlined",
            onPress: closeSheet,
            text: t(m.cancel),
          },
        ]}
        title={t(m.deletePhotoHeader)}
      />
    </BottomSheetModal>
  );
};
