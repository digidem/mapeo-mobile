// @flow
import { CameraRoll } from 'react-native';
import { Observable } from 'rxjs';
import * as ImageResizer from 'react-native-image-resizer';

type MediaType = 'photo' | 'video';

export const saveToCameraRoll = (uri: string, type: MediaType) => {
  if (!uri) {
    return;
  }

  return Observable.from(CameraRoll.saveToCameraRoll(uri, type));
};

export const generateThumbnail = (uri: string) => {
  return Observable.from(
    ImageResizer.default.createResizedImage(uri, 300, 300, 'JPEG', 50)
  );
};
