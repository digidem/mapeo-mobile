// @flow
import { useContext, useRef } from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";

import { matchPreset, addFieldDefinitions } from "../lib/utils";
import bugsnag from "../lib/logger";
import PresetsContext, {
  type PresetWithFields
} from "../context/PresetsContext";
import type {
  ObservationValue,
  ObservationAttachment
} from "../context/ObservationsContext";
import DraftObservationContext, {
  type DraftObservationContextValue,
  type Photo,
  type DraftPhoto
} from "../context/DraftObservationContext";

const log = debug("mapeo:useDraftObservation");

const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 30;
const PREVIEW_SIZE = 1200;
const PREVIEW_QUALITY = 30;

export type CapturePromise = Promise<{
  uri: string,
  width: number,
  height: number,
  rotate?: number
}>;

export type UseDraftObservation = {|
  ...$Exact<DraftObservationContextValue>,
  preset: PresetWithFields,
  /**
   * Adds a photo to the draft observation. The first argument is a promise
   * which returns a uri to a local image file (in temp cache) and the image
   * width and height.
   */
  addPhoto: (capture: CapturePromise) => void,
  // Save a draft
  saveDraft: () => void,
  // Performs a shallow merge of the observation value, like setState
  updateDraft: (value: ObservationValue) => void,
  // Clear the current draft
  clearDraft: () => void,
  // Create a new draft observation
  newDraft: (value: ObservationValue, capture?: CapturePromise) => void
|};

export default (): UseDraftObservation => {
  const [state, setState] = useContext(DraftObservationContext);
  const [{ presets, fields }] = useContext(PresetsContext);

  const pendingPhotos = useRef([]);

  function addPhoto(capture: CapturePromise) {
    // Keep a reference of the "in-progress" photo which we save to state, we
    // will use this later to swap it in state with the captured photo
    const capturingPhoto: DraftPhoto = { capturing: true };
    const photo: DraftPhoto = { capturing: true };

    setState(state => {
      // Bail if capture is finished before we get here
      if (!photo.capturing) return state;
      // Update state to reflect photo in progress of being captured
      return {
        ...state,
        photos: [...state.photos, capturingPhoto]
      };
    });

    let neededRotation: void | number;
    // If we clear the draft we need to track any pending promises and cancel
    // them before they setState
    const capturePromise: any = capture
      .then(({ uri, rotate }) => {
        // rotate will be defined if the original photo failed to rotate (this
        // happens on low-memory devices) so we rotate the preview and
        // thumbnail (rotating the smaller images seems to work ok).
        neededRotation = rotate;
        if (capturePromise.cancelled) throw new Error("Cancelled");
        photo.originalUri = uri;
        return ImageResizer.createResizedImage(
          uri,
          THUMBNAIL_SIZE,
          THUMBNAIL_SIZE,
          "JPEG",
          THUMBNAIL_QUALITY,
          neededRotation
        );
      })
      .then(({ uri }) => {
        if (capturePromise.cancelled) throw new Error("Cancelled");
        bugsnag.leaveBreadcrumb("Generated thumbnail", { type: "process" });
        photo.thumbnailUri = uri;
        return ImageResizer.createResizedImage(
          photo.originalUri,
          PREVIEW_SIZE,
          PREVIEW_SIZE,
          "JPEG",
          PREVIEW_QUALITY,
          neededRotation
        );
      })
      .then(({ uri }) => {
        if (capturePromise.cancelled) throw new Error("Cancelled");
        bugsnag.leaveBreadcrumb("Generated preview", { type: "process" });
        // Remove from pending
        pendingPhotos.current = pendingPhotos.current.filter(
          p => p !== capturePromise
        );
        photo.previewUri = uri;
        photo.capturing = false;
        setState(state => {
          // Replace the capturing photo in state with the now captured photo
          const updatedPhotosState = state.photos.map(p =>
            p === capturingPhoto ? photo : p
          );
          log("new photos state", updatedPhotosState);
          return { ...state, photos: updatedPhotosState };
        });
      })
      .catch(err => {
        // Remove from pending
        pendingPhotos.current = pendingPhotos.current.filter(
          p => p !== capturePromise
        );
        if (capturePromise.cancelled || err.message === "Cancelled")
          return bugsnag.leaveBreadcrumb("Cancelled photo");
        bugsnag.notify(err, report => {
          report.severity = "error";
        });
        photo.error = true;
        photo.capturing = false;
        setState(state => {
          // Replace the capturing photo in state with the now captured photo
          const updatedPhotosState = state.photos.map(p =>
            p === capturingPhoto ? photo : p
          );
          log("new photos state", updatedPhotosState);
          return { ...state, photos: updatedPhotosState };
        });
      });
    pendingPhotos.current.push(capturePromise);
  }

  function updateDraft(value: ObservationValue) {
    setState({
      ...state,
      // $FlowFixMe
      value: {
        ...state.value,
        ...value
      }
    });
  }

  function newDraft(value: ObservationValue, capture?: CapturePromise) {
    // TODO: Cleanup photos and previews in temp storage here
    // Signal any pending photo captures to cancel:
    pendingPhotos.current.forEach(p => (p.cancelled = true));
    pendingPhotos.current = [];
    const photos = filterPhotosFromAttachments(value.attachments);
    setState({
      ...state,
      photos: photos,
      value: value
    });
    if (capture) addPhoto(capture);
  }

  function clearDraft() {
    newDraft({ tags: {} });
  }

  function saveDraft() {}

  const preset = matchPreset(state.value, presets);

  return {
    ...state,
    preset: preset && addFieldDefinitions(preset, fields),
    addPhoto,
    updateDraft,
    newDraft,
    clearDraft,
    saveDraft
  };
};

// Filter photos from an array of observation attachments (we could have videos
// and other media types)
export function filterPhotosFromAttachments(
  attachments: Array<ObservationAttachment> = []
): Array<Photo> {
  return attachments.reduce((acc, att) => {
    if (
      att.type === "image/jpeg" ||
      // This is needed for backwards compat, because early versions did not
      // save a type
      (att.type === undefined && /(\.jpg|\.jpeg)$/i.test(att.id))
    )
      acc.push({ id: att.id, type: att.type });
    return acc;
  }, []);
}
