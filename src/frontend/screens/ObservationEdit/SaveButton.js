// @flow
import React from "react";
// import { StyleSheet } from "react-native";
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

const log = debug("SaveButton");

class SaveButton extends React.PureComponent<Props, State> {
  state = {
    saving: false,
    error: false
  };

  handleSavePress = async () => {
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
