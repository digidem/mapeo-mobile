// @flow
import * as React from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";
import hoistStatics from "hoist-non-react-statics";
import pick from "lodash/pick";
import debounce from "lodash/debounce";
import AsyncStorage from "@react-native-community/async-storage";

import { getDisplayName } from "../lib/utils";
import type { ObservationValue } from "./ObservationsContext";

// WARNING: This needs to change if we change the draft data structure
const STORE_KEY = "@MapeoDraft@2";
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 30;
const PREVIEW_SIZE = 1200;
const PREVIEW_QUALITY = 30;

const log = debug("mapeo:DraftObservationContext");

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
export type Photo = {
  // id of the photo in the Mapeo database, only set if this is already saved
  id?: string,
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
  // If the photo is still being captured
  capturing?: boolean
};

export type CapturePromise = Promise<{
  uri: string,
  width: number,
  height: number
}>;

export type DraftObservationContext = {|
  photos: Photo[],
  value: ObservationValue,
  /**
   * Adds a photo to the draft observation. The first argument is a promise
   * which returns a uri to a local image file (in temp cache) and the image
   * width and height.
   */
  addPhoto: (capture: CapturePromise) => void,
  // Get the photos on a draft once capture is complete. Returns a Promise that
  // resolves with a Photo array once the photos have finished capturing
  getPhotos: () => Promise<Array<Photo>>,
  // Performs a shallow merge of the observation value, like setState
  setValue: (value: ObservationValue) => void,
  // Clear the current draft
  clear: () => void,
  // Create a new draft observation
  newDraft: (value: ObservationValue, capture?: CapturePromise) => void
|};

const defaultContext = {
  photos: [],
  value: { tags: {} },
  addPhoto: () => {},
  getPhotos: () => Promise.resolve(),
  setValue: () => {},
  clear: () => {},
  newDraft: () => {}
};

const {
  Provider,
  Consumer: DraftObservationConsumer
} = React.createContext<DraftObservationContext>(defaultContext);

type Props = {
  children: React.Node
};

/**
 * The DraftObservationProvider is used to manage the local state of any
 * observation that is being edited / created. It saves the state to local
 * storage, in order to recover from app crashes, or the app being forced
 * closed. After a draft has been saved or deleted from Mapeo Core it must be
 * cleared before creating a new draft.
 */
class DraftObservationProvider extends React.Component<
  Props,
  DraftObservationContext
> {
  state = {
    photos: [],
    value: { tags: {} },
    addPhoto: this.addPhoto.bind(this),
    getPhotos: this.getPhotos.bind(this),
    setValue: this.setValue.bind(this),
    clear: this.clear.bind(this),
    newDraft: this.newDraft.bind(this)
  };
  pending = [];
  save = debounce(this.save, 500, { leading: true });

  async componentDidMount() {
    try {
      const savedDraft = await AsyncStorage.getItem(STORE_KEY);
      if (savedDraft != null) {
        const { photos, value } = JSON.parse(savedDraft);
        this.setState({ photos: photos.filter(filterCapturedPhotos), value });
      }
    } catch (e) {
      log("Error reading draft from storage\n", e);
    }
  }

  componentDidUpdate() {
    this.save();
  }

  save() {
    const { photos, value } = this.state;
    try {
      AsyncStorage.setItem(STORE_KEY, JSON.stringify({ photos, value }));
    } catch (e) {
      log("Error writing to storage", e);
    }
  }

  addPhoto(capture: CapturePromise) {
    log("current state", this.state.photos);
    this.setState(
      state => ({
        // If the photo is still being captured
        photos: [...state.photos, { capturing: true }]
      }),
      onSetState
    );

    // Normally it's not good practice to use this callback, and to use
    // componentDidUpdate() instead, but we need to keep the ref to the index
    // 1. Wait for the image capture to complete
    // 2. Resize the image to get a thumbnail ready for display & upload
    function onSetState() {
      const index = this.state.photos.length - 1;
      // If the photo is still being captured
      const photo: Photo = { capturing: false };
      // If we clear the draft we need to track any pending promises and cancel
      // them before they setState
      const capturePromise: any = capture
        .then(({ uri }) => {
          if (capturePromise.cancelled) throw new Error("Cancelled");
          log("captured image", uri);
          photo.originalUri = uri;
          return ImageResizer.createResizedImage(
            uri,
            THUMBNAIL_SIZE,
            THUMBNAIL_SIZE,
            "JPEG",
            THUMBNAIL_QUALITY
          );
        })
        .then(({ uri }) => {
          if (capturePromise.cancelled) throw new Error("Cancelled");
          log("captured image", uri);
          photo.thumbnailUri = uri;
          return ImageResizer.createResizedImage(
            photo.originalUri,
            PREVIEW_SIZE,
            PREVIEW_SIZE,
            "JPEG",
            PREVIEW_QUALITY
          );
        })
        .then(({ uri }) => {
          if (capturePromise.cancelled) throw new Error("Cancelled");
          log("resized image", uri);
          // Remove from pending
          this.pending = this.pending.filter(p => p !== capturePromise);
          photo.previewUri = uri;
          log("new photos state", splice(this.state.photos, index, photo));
          this.setState(state => ({
            photos: splice(state.photos, index, photo)
          }));
        })
        .catch(err => {
          // Remove from pending
          this.pending = this.pending.filter(p => p !== capturePromise);
          if (capturePromise.cancelled || err.message === "Cancelled")
            return log("Cancelled!");
          log("Error capturing image:\n", err);
          photo.error = true;
          this.setState(state => ({
            photos: splice(state.photos, index, photo)
          }));
        });
      this.pending.push(capturePromise);
    }
  }

  async getPhotos() {
    log("getPhotos", this.pending);
    await Promise.all(this.pending);
    return this.state.photos;
  }

  setValue(value: ObservationValue) {
    this.setState({
      value: {
        ...this.state.value,
        ...value
      }
    });
  }

  clear() {
    this.newDraft({ tags: {} });
  }

  newDraft(value: ObservationValue, capture?: CapturePromise) {
    // TODO: Cleanup photos and previews in temp storage here
    // Signal any pending photo captures to cancel:
    this.pending.forEach(p => (p.cancelled = true));
    this.pending = [];
    const photos = (value.attachments || [])
      .filter(a => !a.type || a.type === "image/jpeg")
      .map(a => ({ ...a }));
    this.setState(
      {
        photos: photos,
        value: value
      },
      () => {
        if (capture) this.addPhoto(capture);
      }
    );
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const withDraft = (keys?: Array<$Keys<DraftObservationContext>>) => (
  WrappedComponent: any
) => {
  const WithDraft = (props: any) => (
    <DraftObservationConsumer>
      {draft => {
        if (!keys) return <WrappedComponent {...props} draft={draft} />;
        const addedProps = pick(draft, keys);
        return <WrappedComponent {...props} {...addedProps} />;
      }}
    </DraftObservationConsumer>
  );
  WithDraft.displayName = `WithDraft(${getDisplayName(WrappedComponent)})`;
  return hoistStatics(WithDraft, WrappedComponent);
};

export default {
  Provider: DraftObservationProvider,
  Consumer: DraftObservationConsumer
};

// Returns a new array with element at index replaced with value
function splice(arr: Array<*>, index: number, value: any) {
  const newArray = [...arr];
  newArray[index] = value;
  return newArray;
}

// If we crash during photo capture and restore state from async storage, then,
// unfortunately, any photos that did not finish capturing are lost :(
function filterCapturedPhotos(photo: Photo) {
  return photo.id || photo.originalUri;
}
