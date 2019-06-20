// @flow
import * as React from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";
import hoistStatics from "hoist-non-react-statics";
import pick from "lodash/pick";
import debounce from "lodash/debounce";
import AsyncStorage from "@react-native-community/async-storage";

import { getDisplayName } from "../lib/utils";
import bugsnag from "../lib/logger";
import type {
  ObservationValue,
  ObservationAttachment
} from "./ObservationsContext";

// WARNING: This needs to change if we change the draft data structure
const STORE_KEY = "@MapeoDraft@2";
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 30;
const PREVIEW_SIZE = 1200;
const PREVIEW_QUALITY = 30;

const log = debug("mapeo:DraftObservationContext");

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

export type CapturePromise = Promise<{
  uri: string,
  width: number,
  height: number,
  rotate?: number
}>;

export type DraftObservationContext = {|
  photos: Array<Photo>,
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
    value: { tags: {}, locationSetManually: false },
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
      const photo: DraftPhoto = { capturing: false };
      let neededRotation;
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
            return bugsnag.leaveBreadcrumb("Cancelled photo");
          bugsnag.notify(err, report => {
            report.severity = "error";
          });
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
    const photos = filterPhotosFromAttachments(value.attachments);
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
function filterCapturedPhotos(photo: Photo): boolean {
  if (typeof photo.id === "string") return true;
  if (typeof photo.originalUri === "string") return true;
  return false;
}

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
