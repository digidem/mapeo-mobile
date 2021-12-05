import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { RED } from "../../lib/styles";

import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../sharedComponents/BottomSheetModal";
import { AlertIcon, ErrorIcon } from "../../sharedComponents/icons";
import Circle from "../../sharedComponents/icons/Circle";
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
    defaultMessage: "Cancel",
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
    console.log(photoToDelete);
    if ("originalUri" in photoToDelete) {
      const uri = photoToDelete.originalUri;
      deletePhoto(uri!);
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
            onPress: () => photoDelete(),
            text: t(m.deletePhotoButton),
          },
          {
            variation: "outlined",
            onPress: closeSheet,
            text: t(m.cancel),
          },
        ]}
        title={t(m.deletePhotoHeader)}
        icon={
          <Circle radius={40}>
            <ErrorIcon size={80} color={RED} />
          </Circle>
        }
      />
    </BottomSheetModal>
  );
};
