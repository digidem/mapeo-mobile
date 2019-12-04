// @flow
import { useContext, useState, useCallback } from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";

import api from "../api";
import {
  matchPreset,
  addFieldDefinitions,
  filterPhotosFromAttachments
} from "../lib/utils";
import bugsnag from "../lib/logger";
import type { Status } from "../types";

import PresetsContext, {
  type PresetWithFields
} from "../context/PresetsContext";
import ObservationsContext, {
  type ObservationValue,
  type ObservationAttachment
} from "../context/ObservationsContext";
import DraftObservationContext, {
  type DraftObservationContextState,
  type DraftPhoto
} from "../context/DraftObservationContext";

const log = debug("mapeo:useDraftObservation");

const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 30;
const PREVIEW_SIZE = 1200;
const PREVIEW_QUALITY = 30;

type Signal = { didCancel: boolean };

export type CapturePromise = Promise<{
  uri: string,
  width: number,
  height: number,
  rotate?: number
}>;

export type UseDraftObservation = [
  {|
    value: $ElementType<DraftObservationContextState, "value">,
    photos: $ElementType<DraftObservationContextState, "photos">,
    loading: $ElementType<DraftObservationContextState, "loading">,
    savingStatus: Status,
    preset?: PresetWithFields
  |},
  {|
    /**
     * Adds a photo to the draft observation. The first argument is a promise
     * which returns a uri to a local image file (in temp cache) and the image
     * width and height.
     */
    addPhoto: (capture: CapturePromise) => Promise<void>,
    // Save a draft
    saveDraft: () => Promise<void>,
    // Performs a shallow merge of the observation value, like setState
    updateDraft: (value: ObservationValue) => void,
    // Clear the current draft
    clearDraft: () => void,
    // Create a new draft observation
    newDraft: (
      id?: string,
      value?: ObservationValue | null,
      capture?: CapturePromise
    ) => void
  |}
];

type CancellablePromise<T> = Promise<T> & { signal?: { didCancel: boolean } };

export default (): UseDraftObservation => {
  const [draft, setDraft] = useContext(DraftObservationContext);
  const [{ observations }, dispatch] = useContext(ObservationsContext);
  const [{ presets, fields }] = useContext(PresetsContext);
  const [savingStatus, setSavingStatus] = useState<Status>("idle");

  const addPhoto = useCallback(
    async function addPhoto(capturePromise: CapturePromise) {
      // Keep a reference of the "in-progress" photo which we save to state, we
      // will use this later to swap it in state with the captured photo
      const capturingPhoto: DraftPhoto = { capturing: true };

      // Use signal to cancel processing by setting signal.didCancel = true
      // Important because image resize/rotate is expensive
      const signal = {};
      const photoPromise: CancellablePromise<DraftPhoto> = processPhoto(
        capturePromise,
        signal
      );
      photoPromise.signal = signal;

      setDraft(draft => ({
        ...draft,
        photoPromises: [...draft.photoPromises, photoPromise],
        photos: [...draft.photos, capturingPhoto]
      }));

      let photo;
      try {
        photo = await photoPromise;
      } catch (err) {
        photo = { capturing: false, error: true };
        if (signal.didCancel || err.message === "Cancelled")
          bugsnag.leaveBreadcrumb("Cancelled photo");
        else bugsnag.notify(err, report => (report.severity = "error"));
      } finally {
        setDraft(draft => {
          // Replace the capturing photo in state with the now captured photo
          const updatedPhotosState = draft.photos.map(p =>
            p === capturingPhoto ? photo : p
          );
          log("new photos state", updatedPhotosState);
          return { ...draft, photos: updatedPhotosState };
        });
      }
    },
    [setDraft]
  );

  const updateDraft = useCallback(
    (value: ObservationValue) => {
      setDraft(draft => ({
        ...draft,
        // $FlowFixMe
        value: {
          ...draft.value,
          ...value
        }
      }));
    },
    [setDraft]
  );

  const newDraft = useCallback(
    (
      id?: string,
      value?: ObservationValue | null = { tags: {} },
      capture?: CapturePromise
    ) => {
      function cancelPhotoProcessing() {
        // TODO: Cleanup photos and previews in temp storage here
        // Signal any pending photo captures to cancel:
        draft.photoPromises.forEach(
          p => p.signal && (p.signal.didCancel = true)
        );
      }
      cancelPhotoProcessing();
      setDraft(draft => ({
        ...draft,
        photoPromises: [],
        // $FlowFixMe
        photos: value ? filterPhotosFromAttachments(value.attachments) : [],
        value: value,
        observationId: id
      }));
      if (capture) addPhoto(capture);
    },
    [addPhoto, draft.photoPromises, setDraft]
  );

  const clearDraft = useCallback(() => {
    newDraft(undefined, null);
  }, [newDraft]);

  async function saveDraft() {
    log("saveDraft call");
    setSavingStatus("loading");
    const draftValue = draft.value;
    if (!draftValue) {
      // Shouldn't get here
      bugsnag.notify(
        new Error("Tried to save null draft"),
        report => (report.severity = "error")
      );

      return;
    }
    try {
      // Wait for all the photos to be ready
      const newPhotos: Array<DraftPhoto | void> = await Promise.all(
        // This ensures that this resolves to an array even if some photos fail
        // to capture - they will be undefined in the array.
        // https://twitter.com/jaffathecake/status/833668073475416064
        draft.photoPromises.map(p =>
          p.catch(e => {
            log("photo capture error", e);
          })
        )
      );
      log("new photos ready", newPhotos);
      const toCreate = getPhotosToCreate(newPhotos);
      // const toDelete = draft.photos.filter(p => p.id && p.deleted);

      // A little bit hairy this one... we basically want to keep the original
      // attachments except those which have been marked deleted in the draft
      const existingAttachments = (draftValue.attachments || []).filter(a => {
        const attachmentInDraft = draft.photos.find(p => p.id && p.id === a.id);
        return !(attachmentInDraft && attachmentInDraft.deleted);
      });

      const savedAttachments = await Promise.all(toCreate.map(api.savePhoto));
      const newObservationValue = {
        ...draftValue,
        attachments: existingAttachments.concat(
          savedAttachments.map(addMimeType)
        )
      };
      const existingObservation =
        draft.observationId !== undefined
          ? observations.get(draft.observationId)
          : undefined;
      if (existingObservation) {
        const updatedObservation = await api.updateObservation(
          existingObservation.id,
          newObservationValue,
          { links: [existingObservation.version] }
        );
        dispatch({ type: "update", value: updatedObservation });
      } else {
        log("create observation", newObservationValue);
        const newObservation = await api.createObservation(newObservationValue);
        dispatch({ type: "create", value: newObservation });
      }
      setSavingStatus("success");
    } catch (e) {
      log("save draft error", e);
      bugsnag.notify(e, report => (report.severity = "error"));
      setSavingStatus("error");
    }
  }

  const preset = draft.value ? matchPreset(draft.value, presets) : undefined;

  return [
    {
      value: draft.value,
      photos: draft.photos,
      loading: draft.loading,
      savingStatus: savingStatus,
      preset: preset && addFieldDefinitions(preset, fields)
    },
    { addPhoto, updateDraft, newDraft, clearDraft, saveDraft }
  ];
};

async function processPhoto(
  capturePromise: CapturePromise,
  { didCancel = false }: Signal
): Promise<DraftPhoto> {
  const photo: DraftPhoto = { capturing: false };
  const { uri: originalUri, rotate } = await capturePromise;
  if (didCancel) throw new Error("Cancelled");
  log("captured photo");
  bugsnag.leaveBreadcrumb("Captured photo", { type: "process" });
  photo.originalUri = originalUri;
  // rotate will be defined if the original photo failed to rotate (this
  // happens on low-memory devices) so we rotate the preview and
  // thumbnail (rotating the smaller images seems to work ok).
  const { uri: thumbnailUri } = await ImageResizer.createResizedImage(
    originalUri,
    THUMBNAIL_SIZE,
    THUMBNAIL_SIZE,
    "JPEG",
    THUMBNAIL_QUALITY,
    rotate
  );
  if (didCancel) throw new Error("Cancelled");
  log("created thumbnail");
  bugsnag.leaveBreadcrumb("Generated thumbnail", { type: "process" });
  photo.thumbnailUri = thumbnailUri;
  const { uri: previewUri } = await ImageResizer.createResizedImage(
    originalUri,
    PREVIEW_SIZE,
    PREVIEW_SIZE,
    "JPEG",
    PREVIEW_QUALITY,
    rotate
  );
  if (didCancel) throw new Error("Cancelled");
  log("created preview");
  bugsnag.leaveBreadcrumb("Generated preview", { type: "process" });
  photo.previewUri = previewUri;
  return photo;
}
function addMimeType(attachment: { id: string }): ObservationAttachment {
  return {
    ...attachment,
    type: "image/jpeg"
  };
}

function getPhotosToCreate(
  photos: Array<DraftPhoto | void>
): Array<DraftPhoto> {
  // $FlowFixMe - flow seems to have trouble with array filters and type refinement
  return photos.filter(p => p !== undefined && !p.deleted);
}
