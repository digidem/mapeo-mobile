// @flow
import * as React from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";
import hoistStatics from "hoist-non-react-statics";
import pick from "lodash/pick";

import { getDisplayName } from "../lib/utils";
import type { ObservationValue } from "./ObservationsContext";

const log = debug("mapeo:DraftObservationContext");

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
export type Photo = {|
  // id of the photo in the Mapeo database, only set if this is already saved
  id?: string,
  // uri to a local thumbnail image (this is uploaded to Mapeo server)
  thumbnailUri?: string,
  // uri to a local full-resolution image (this is uploaded to Mapeo server)
  fullUri?: string,
  // If an image is to be deleted
  deleted?: boolean,
  // If there was any kind of error on image capture
  error?: boolean,
  // If the photo is still being captured
  capturing: boolean
|};

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
   * width and height. Optionally can pass a promise as a second argument that
   * resolves to a uri of a preview image, for faster display of the thumbnail
   * during full-size photo capture
   */
  addPhoto: (capture: CapturePromise) => void,
  // Save draft to server
  save: () => void,
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
  save: () => {},
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

class DraftObservationProvider extends React.Component<
  Props,
  DraftObservationContext
> {
  state = {
    photos: [],
    value: { tags: {} },
    addPhoto: this.addPhoto.bind(this),
    save: this.getForSave.bind(this),
    setValue: this.setValue.bind(this),
    clear: this.clear.bind(this),
    newDraft: this.newDraft.bind(this)
  };
  pending = [];

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
      const signal = {};
      this.pending.push(signal);
      capture
        .then(({ uri, width, height }) => {
          if (signal.cancelled) throw new Error("Cancelled");
          log("captured image", uri, signal);
          photo.fullUri = uri;
          return ImageResizer.createResizedImage(uri, 300, 300, "JPEG", 50);
        })
        .then(({ uri }) => {
          if (signal.cancelled) throw new Error("Cancelled");
          log("resized image", uri, signal);
          // Remove from pending
          this.pending = this.pending.filter(s => s !== signal);
          photo.thumbnailUri = uri;
          this.setState(state => ({
            photos: splice(state.photos, index, photo)
          }));
        })
        .catch(err => {
          // Remove from pending
          this.pending = this.pending.filter(s => s !== signal);
          if (signal.cancelled || err.message === "Cancelled")
            return log("Cancelled!");
          log("Error capturing image:\n", err, signal);
          photo.error = true;
          this.setState(state => ({
            photos: splice(state.photos, index, photo)
          }));
        });
    }
  }

  getForSave() {}

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
    this.pending.forEach(signal => (signal.cancelled = true));
    this.pending = [];
    this.setState(
      {
        photos: [],
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
