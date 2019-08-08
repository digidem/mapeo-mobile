// @flow
import * as React from "react";
import debug from "debug";
import AsyncStorage from "@react-native-community/async-storage";

import type { UseState, Status } from "../types";
import type { ObservationValue } from "./ObservationsContext";

// WARNING: This needs to change if we change the draft data structure
const STORE_KEY = "@MapeoDraft@2";

const log = debug("mapeo:DraftObservationContext");

// save = debounce(this.save, 500, { leading: true });

// Photo from an existing observation that are already saved
export type SavedPhoto = {|
  // id of the photo in the Mapeo database
  id: string,
  type?: "image/jpeg",
  // If an image is to be deleted
  deleted?: boolean
|};

// Photo added to a draft observation, that has not yet been saved
// It is added to the draft observation as soon as capturing starts, when it
// does not yet have any image associated with it
export type DraftPhoto = {|
  // If the photo is still being captured
  capturing: boolean,
  // uri to a local thumbnail image (this is uploaded to Mapeo server)
  thumbnailUri?: string,
  // uri to a local preview image
  previewUri?: string,
  // uri to a local full-resolution image (this is uploaded to Mapeo server)
  originalUri?: string,
  // If an image is to be deleted
  deleted?: boolean,
  // If there was any kind of error on image capture
  error?: boolean
|};

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
export type Photo = SavedPhoto | DraftPhoto;

export type DraftObservationContextState = {|
  photos: Array<Photo>,
  value: ObservationValue | null,
  photoPromises: Array<
    Promise<DraftPhoto> & { signal?: { didCancel: boolean } }
  >,
  loading: boolean,
  savingStatus?: Status,
  observationId?: string
|};

export type DraftObservationContextType = UseState<DraftObservationContextState>;

const defaultContext: DraftObservationContextType = [
  {
    photos: [],
    value: null,
    photoPromises: [],
    loading: true
  },
  () => {}
];

const DraftObservationContext = React.createContext<DraftObservationContextType>(
  defaultContext
);

type Props = {
  children: React.Node
};

export const DraftObservationProvider = ({ children }: Props) => {
  const [state, setState] = React.useState(defaultContext[0]);
  const contextValue = React.useMemo(() => [state, setState], [state]);

  // When the app first mounts, load draft from storage
  React.useEffect(() => {
    let didCancel = false;
    AsyncStorage.getItem(STORE_KEY)
      .then(savedDraft => {
        if (savedDraft == null || didCancel) return;
        const { photos, value } = JSON.parse(savedDraft);
        setState(state => ({
          ...state,
          photos: photos.filter(filterCapturedPhotos),
          value,
          loading: false
        }));
      })
      .catch(e => {
        log("Error reading draft from storage", e);
        setState(state => ({ ...state, loading: false }));
      });
    return () => {
      didCancel = true;
    };
  }, []);

  // Save draft to local storage on every update
  React.useEffect(() => {
    const { photos, value } = state;
    AsyncStorage.setItem(STORE_KEY, JSON.stringify({ photos, value })).catch(
      e => {
        log("Error writing to storage", e);
      }
    );
  });

  return (
    <DraftObservationContext.Provider value={contextValue}>
      {children}
    </DraftObservationContext.Provider>
  );
};

export default DraftObservationContext;

// If we crash during photo capture and restore state from async storage, then,
// unfortunately, any photos that did not finish capturing are lost :(
function filterCapturedPhotos(photo: Photo): boolean {
  if (typeof photo.id === "string") return true;
  if (typeof photo.originalUri === "string") return true;
  return false;
}
