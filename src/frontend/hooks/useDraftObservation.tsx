import { useContext, useState, useCallback } from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";
import isEqual from "lodash/isEqual";
import { Observation } from "mapeo-schema";

import api from "../api";
import ConfigContext, { PresetWithFields } from "../context/ConfigContext";
import DraftObservationContext, {
  DraftObservationContextState,
  DraftPhoto,
  Signal,
} from "../context/DraftObservationContext";
import ObservationsContext, {
  ClientGeneratedObservation,
  ObservationAttachment,
} from "../context/ObservationsContext";
import bugsnag from "../lib/logger";
import {
  matchPreset,
  addFieldDefinitions,
  filterPhotosFromAttachments,
} from "../lib/utils";
import type { Status } from "../types";

<<<<<<< HEAD:src/frontend/hooks/useDraftObservation.ts
=======
import ConfigContext, { PresetWithFields } from "../context/ConfigContext";
import ObservationsContext, {
  ObservationValue,
  ObservationAttachment,
} from "../context/ObservationsContext";
import DraftObservationContext, {
  DraftObservationContextState,
  DraftPhoto,
} from "../context/DraftObservationContext";

>>>>>>> 89ff4378 (chore: update hook and context to typescript):src/frontend/hooks/useDraftObservation.tsx
const log = debug("mapeo:useDraftObservation");

const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 30;
const PREVIEW_SIZE = 1200;
const PREVIEW_QUALITY = 30;

export type CapturedPictureMM = {
  uri: string;
  rotate?: number;
};

<<<<<<< HEAD:src/frontend/hooks/useDraftObservation.ts
type CancellablePromise<T> = Promise<T> & { signal?: Signal };

type UseDraftObservation = [
=======
export type UseDraftObservation = [
>>>>>>> 89ff4378 (chore: update hook and context to typescript):src/frontend/hooks/useDraftObservation.tsx
  {
    value: DraftObservationContextState["value"];
    photos: DraftObservationContextState["photos"];
    observationId: DraftObservationContextState["observationId"];
    savingStatus: Status;
    preset?: PresetWithFields;
  },
  {
    /**
     * Adds a photo to the draft observation. The first argument is a promise
     * which returns a uri to a local image file (in temp cache) and the image
     * width and height.
     */
    addPhoto: (capture: Promise<CapturedPictureMM>) => Promise<void>;
    // Save a draft
    saveDraft: () => Promise<void>;
    // Performs a shallow merge of the observation value, like setState
<<<<<<< HEAD:src/frontend/hooks/useDraftObservation.ts
    updateDraft: (value: ClientGeneratedObservation) => void;
=======
    updateDraft: (value: ObservationValue) => void;
>>>>>>> 89ff4378 (chore: update hook and context to typescript):src/frontend/hooks/useDraftObservation.tsx
    // Clear the current draft
    clearDraft: () => void;
    // Create a new draft observation
    newDraft: (
      id?: string,
      value?: Observation | null,
      capture?: Promise<CapturedPictureMM>
    ) => void;
  }
];

export const useDraftObservation = (): UseDraftObservation => {
  const [draft, setDraft] = useContext(DraftObservationContext);
  const [{ presets, fields }] = useContext(ConfigContext);
  const [{ observations }, observationsDispatch] = useContext(
    ObservationsContext
  );
  const [savingStatus, setSavingStatus] = useState<Status>();

  const addPhoto = useCallback(
    async (capturePromise: Promise<CapturedPictureMM>) => {
      // Keep a reference of the "in-progress" photo which we save to state, we
      // will use this later to swap it in state with the captured photo
      const capturingPhoto: DraftPhoto = { capturing: true };

      // Use signal to cancel processing by setting signal.didCancel = true
      // Important because image resize/rotate is expensive
<<<<<<< HEAD:src/frontend/hooks/useDraftObservation.ts
      const signal: Signal = {};

=======
      const signal = { didCancel: false };
>>>>>>> 89ff4378 (chore: update hook and context to typescript):src/frontend/hooks/useDraftObservation.tsx
      const photoPromise: CancellablePromise<DraftPhoto> = processPhoto(
        capturePromise,
        signal
      );

      photoPromise.signal = signal;

      setDraft(draft => ({
        ...draft,
        photoPromises: [...draft.photoPromises, photoPromise],
        photos: [...draft.photos, capturingPhoto],
      }));

<<<<<<< HEAD:src/frontend/hooks/useDraftObservation.ts
      let photo: DraftPhoto;

=======
      let photo: DraftPhoto | { capturing: boolean; error: boolean };
>>>>>>> 89ff4378 (chore: update hook and context to typescript):src/frontend/hooks/useDraftObservation.tsx
      try {
        photo = await photoPromise;
      } catch (err) {
        if (!(err instanceof Error)) return;

        photo = { capturing: false, error: true };

        if (signal.didCancel || err.message === "Cancelled")
          bugsnag.leaveBreadcrumb("Cancelled photo");
        else {
          bugsnag.notify(err, report => {
            report.severity = "error";
          });
        }
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

  const cancelPhotoProcessing = useCallback(() => {
    // TODO: Cleanup photos and previews in temp storage here
    // Signal any pending photo captures to cancel:
    draft.photoPromises.forEach(p => p.signal && (p.signal.didCancel = true));
  }, [draft.photoPromises]);

  const newDraft = useCallback(
    (
      id?: string,
      value: ClientGeneratedObservation | Observation | null = {
        tags: {},
      },
      capture?: Promise<CapturedPictureMM>
    ) => {
      cancelPhotoProcessing();

      setDraft({
        observationId: id,
        photoPromises: [],
        photos: value ? filterPhotosFromAttachments(value.attachments) : [],
        value,
      });

      if (capture) addPhoto(capture);
    },
    [addPhoto, cancelPhotoProcessing, setDraft]
  );

  const clearDraft = useCallback(() => {
    cancelPhotoProcessing();
    setDraft({
      photoPromises: [],
      photos: [],
      value: null,
    });
  }, [cancelPhotoProcessing, setDraft]);

  const updateDraft = useCallback(
    (value: ClientGeneratedObservation) => {
      setDraft(draft => ({
        ...draft,
        value: {
          ...draft.value,
          ...value,
        },
      }));
    },
    [setDraft]
  );

  const saveDraft = async () => {
    log("saveDraft call");

    const existingObservation =
      draft.observationId !== undefined
        ? observations.get(draft.observationId)
        : undefined;

    const isUntouched =
      existingObservation &&
      isEqual(existingObservation, draft.value) &&
      isEqual(
        filterPhotosFromAttachments(existingObservation.attachments),
        draft.photos
      );

    if (isUntouched) {
      // If draft isn't dirty, no need to save
      setSavingStatus("success");
      return;
    }

    setSavingStatus("loading");

    const draftValue = draft.value;

    if (!draftValue) {
      // Shouldn't get here
      bugsnag.notify(new Error("Tried to save null draft"), report => {
        report.severity = "error";
      });

      return;
    }

    try {
      // Wait for all the photos to be ready
      const newPhotos = await Promise.all(
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

      // A little bit hairy this one... we basically want to keep the original
      // attachments except those which have been marked deleted in the draft
      const existingAttachments = (draftValue.attachments || []).filter(a => {
        const attachmentInDraft = draft.photos.find(
          p => "id" in p && p.id === a.id
        );
        return !attachmentInDraft?.deleted;
      });

      const savedAttachments = await Promise.all(toCreate.map(api.savePhoto));

      const newObservationValue = {
        ...draftValue,
        attachments: existingAttachments.concat(
          savedAttachments.map(addMimeType)
        ),
      };

      if (existingObservation) {
        const updatedObservation = await api.updateObservation(
          existingObservation.id,
          newObservationValue,
          { links: [existingObservation.version] }
        );

        observationsDispatch({ type: "update", value: updatedObservation });
      } else {
        log("create observation", newObservationValue);

        const newObservation = await api.createObservation(newObservationValue);

        observationsDispatch({ type: "create", value: newObservation });
      }

      setSavingStatus("success");
    } catch (err) {
      if (!(err instanceof Error)) return;

      log("save draft error", err);

      bugsnag.notify(err, report => {
        report.severity = "error";
      });

      setSavingStatus("error");
    }
  };

  const preset = draft.value ? matchPreset(draft.value, presets) : undefined;

  return [
    {
      observationId: draft.observationId,
      photos: draft.photos,
      preset: preset ? addFieldDefinitions(preset, fields) : undefined,
      savingStatus: savingStatus,
      value: draft.value,
    },
    {
      addPhoto,
      clearDraft,
      newDraft,
      saveDraft,
      updateDraft,
    },
  ];
};

async function processPhoto(
  capturePromise: Promise<CapturedPictureMM>,
  { didCancel = false }: Signal
) {
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
    type: "image/jpeg",
  };
}

type NonVoid<T> = T extends void ? never : T;

function notVoid<T>(value: T): value is NonVoid<T> {
  return value !== undefined && value !== null;
}

function getPhotosToCreate(photos: (DraftPhoto | void)[]) {
  return photos.filter(notVoid).filter(p => !p.deleted);
}
