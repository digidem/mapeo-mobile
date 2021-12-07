import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { RED } from "../../lib/styles";

import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../sharedComponents/BottomSheetModal";
import { AlertIcon, ErrorIcon } from "../../sharedComponents/icons";
import Circle from "../../sharedComponents/icons/Circle";
import Text from "../../sharedComponents/Text";
import { NavigationProp } from "../../types";

interface ModalProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  photoIndex: number;
  closeSheet: () => void;
  navigationProp: NavigationProp;
  disableBackdrop: boolean;
}

const m = defineMessages({
  deletePhotoHeader: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoHeader",
    defaultMessage: "Delete this photo?",
  },
  deletePhotoButton: {
    id: "screens.Photos.ConfirmDeleteModal.deletePhotoButton",
    defaultMessage: "Delete Image",
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
  disableBackdrop,
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
    <BottomSheetModal
      ref={sheetRef}
      disableBackrop={disableBackdrop}
      onDismiss={closeSheet}
    >
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
          <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        }
      />
    </BottomSheetModal>
  );
};
