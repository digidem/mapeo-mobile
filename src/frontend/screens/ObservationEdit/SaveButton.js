// @flow
import React from "react";
import { Alert } from "react-native";
import debug from "debug";

import IconButton from "../../sharedComponents/IconButton";
import { SaveIcon } from "../../sharedComponents/icons";
import { withDraft } from "../../context/DraftObservationContext";
import { withObservations } from "../../context/ObservationsContext";
import { savePhoto } from "../../api";
import type { NavigationScreenProp } from "react-navigation";
import type {
  ObservationAttachment,
  ObservationsContext
} from "../../context/ObservationsContext";
import type { DraftObservationContext } from "../../context/DraftObservationContext";

type Props = {
  navigation: NavigationScreenProp<{}>,
  draft: DraftObservationContext,
  create: $ElementType<ObservationsContext, "create">
};

type State = {
  saving: boolean,
  error: boolean
};

const MINIMUM_ACCURACY = 10;
const log = debug("SaveButton");

class SaveButton extends React.PureComponent<Props, State> {
  state = {
    saving: false,
    error: false
  };

  handleSavePress = async () => {
    const { navigation, draft } = this.props;
    const isNew = navigation.getParam("observationId") === undefined;
    if (!isNew) return this.doSave();
    if (draft.value.lat === undefined && draft.value.lon === undefined) {
      Alert.alert(
        "No GPS Location",
        "This observation does not have a location, you can keep waiting or save the observation without a location",
        [
          {
            text: "Keep waiting",
            onPress: () => log("Cancelled save"),
            style: "cancel"
          },
          {
            text: "Save anyway",
            onPress: this.doSave,
            style: "default"
          }
        ]
      );
    } else if (
      draft.value.metadata &&
      draft.value.metadata.location &&
      draft.value.metadata.location.position &&
      draft.value.metadata.location.position.coords.accuracy > MINIMUM_ACCURACY
    ) {
      Alert.alert(
        "Weak GPS Signal",
        "The accuracy of the GPS location of this observation is not very good. You can keep waiting for better accuracy, or save anyway",
        [
          {
            text: "Keep waiting",
            onPress: () => log("Cancelled save"),
            style: "cancel"
          },
          {
            text: "Save anyway",
            onPress: this.doSave,
            style: "default"
          }
        ]
      );
    } else {
      this.doSave();
    }
  };

  doSave = async () => {
    const { navigation, create, draft } = this.props;
    log("start save");
    this.setState({ saving: true });
    try {
      log(Object.keys(draft));
      const photos = await draft.getPhotos();
      const toCreate = photos.filter(p => !p.id && !p.deleted && !p.error);
      // const toDelete = photos.filter(p => p.id && p.deleted);

      // A little bit hairy this one... we basically want to keep the original
      // attachments except those which have been marked deleted in the draft
      const existingAttachments = (draft.value.attachments || []).filter(a => {
        const attachmentInDraft = photos.find(p => p.id === a.id);
        return !(attachmentInDraft && attachmentInDraft.deleted);
      });

      const savedAttachments = await Promise.all(toCreate.map(savePhoto));
      const newObservationValue = {
        ...draft.value,
        attachments: existingAttachments.concat(
          savedAttachments.map(addMimeType)
        )
      };
      await create(newObservationValue);
      // $FlowFixMe
      navigation.pop();
      draft.clear();
    } catch (e) {
      log("Error:\n", e);
      this.setState({ error: true });
    } finally {
      this.setState({ saving: false });
    }
  };

  render() {
    return (
      <IconButton onPress={this.handleSavePress}>
        <SaveIcon inprogress={this.state.saving} />
      </IconButton>
    );
  }
}

export default withObservations(["create"])(withDraft()(SaveButton));

function addMimeType(attachment: { id: string }): ObservationAttachment {
  return {
    ...attachment,
    type: "image/jpeg"
  };
}

// const styles = StyleSheet.create({

// });
