// @flow
import * as React from "react";
import ImageResizer from "react-native-image-resizer";
import debug from "debug";

import type { ObservationValue } from "./ObservationsContext";

const log = debug("mapeo:DraftObservationContext");

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
type Photo = {
  // id of the photo in the Mapeo database, only set if this is already saved
  id?: string,
  // uri to a local thumbnail image (this is uploaded to Mapeo server)
  thumbnailUri?: string,
  // uri to a temporary preview image, discarded after save
  previewUri?: string,
  // uri to a local full-resolution image (this is uploaded to Mapeo server)
  fullUri?: string,
  // If an image is to be deleted
  deleted?: boolean,
  // If there was any kind of error on image capture
  error?: boolean
};

type CapturePromise = Promise<{ uri: string, width: number, height: number }>;

export type DraftObservationContext = {|
  photos: Photo[],
  value: ObservationValue | null,
  /**
   * Adds a photo to the draft observation. The first argument is a promise
   * which returns a uri to a local image file (in temp cache) and the image
   * width and height. Optionally can pass a promise as a second argument that
   * resolves to a uri of a preview image, for faster display of the thumbnail
   * during full-size photo capture
   */
  addPhoto: (capture: CapturePromise, preview?: Promise<string>) => void,
  // Wait for photos to finish saving and return an ObservationValue object
  // ready to be saved in the database
  getForSave: (cb: (error: Error, ObservationValue) => any) => void,
  // Performs a shallow merge of the observation value, like setState
  setValue: ObservationValue => void,
  // Clear the current draft
  clear: () => void
|};

const defaultContext = {
  photos: [],
  value: null,
  addPhoto: () => {},
  getForSave: () => {},
  setValue: () => {},
  clear: () => {}
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
    value: null,
    addPhoto: this.addPhoto.bind(this),
    getForSave: this.getForSave.bind(this),
    setValue: this.setValue.bind(this),
    clear: this.clear.bind(this)
  };

  addPhoto(capture: CapturePromise) {
    const { photos } = this.state;
    const self = this;
    const index = photos.length;
    this.setState(
      state => ({
        photos: [...state.photos, {}]
      }),
      onSetState
    );

    // Normally it's not good practice to use this callback, and to use
    // componentDidUpdate() instead, but we need to keep the ref to the index
    // 1. Wait for the image capture to complete
    // 2. Resize the image to get a thumbnail ready for display & upload
    function onSetState() {
      log("Set state done");
      const photo: Photo = {};
      capture
        .then(({ uri, width, height }) => {
          log("captured image", uri);
          photo.fullUri = uri;
          return ImageResizer.createResizedImage(uri, 300, 300, "JPEG", 50);
        })
        .then(({ uri }) => {
          log("resized image", uri);
          photo.thumbnailUri = uri;
          log("new photo", photo);
          self.setState(state => ({
            photos: splice(state.photos, index, photo)
          }));
        })
        .catch(err => {
          log("Error capturing image:\n", err);
          photo.error = true;
          self.setState(state => ({
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
    // TODO: Cleanup photos and previews in temp storage here
    this.setState({
      photos: [],
      value: null
    });
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

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
