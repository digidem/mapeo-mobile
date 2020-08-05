// @flow
import * as React from "react";

import createPersistedState from "../hooks/usePersistedState";

import type { UseState } from "../types";
import type { ObservationValue } from "./ObservationsContext";

// WARNING: This needs to change if we change the draft data structure
const STORE_KEY = "@MapeoDraft@2";

// save = debounce(this.save, 500, { leading: true });

// Photo from an existing observation that are already saved
export type SavedPhoto = {|
  // id of the photo in the Mapeo database
  id: string,
  type?: "image/jpeg",
  // If an image is to be deleted
  deleted?: boolean,
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
  error?: boolean,
|};

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
export type Photo = SavedPhoto | DraftPhoto;

export type DraftObservationContextState = {|
  photos: Array<SavedPhoto | DraftPhoto>,
  value: ObservationValue | null,
  photoPromises: Array<
    Promise<DraftPhoto> & { signal?: { didCancel: boolean } }
  >,
  observationId?: string,
|};

const usePersistedState = createPersistedState(
  STORE_KEY,
  // Don't store photoPromises in persisted storage
  // Filter out photos that didn't finish capturing (they are lost)
  {
    stringify: ({ photoPromises, photos, ...rest }) =>
      JSON.stringify({ photos: photos.filter(filterCapturedPhotos), ...rest }),
    parse: json => ({ photoPromises: [], ...JSON.parse(json) }),
  }
);

export type DraftObservationContextType = UseState<DraftObservationContextState>;

const defaultContext: DraftObservationContextType = [
  {
    photos: [],
    value: null,
    photoPromises: [],
  },
  () => {},
];

const DraftObservationContext = React.createContext<DraftObservationContextType>(
  defaultContext
);

type Props = {
  children: React.Node,
};

export const DraftObservationProvider = ({ children }: Props) => {
  const [
    state,
    status,
    setState,
  ] = usePersistedState<DraftObservationContextState>(defaultContext[0]);
  const contextValue = React.useMemo(() => [state, setState], [
    state,
    setState,
  ]);

  return (
    <DraftObservationContext.Provider value={contextValue}>
      {status === "loading" ? null : children}
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
