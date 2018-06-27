import { CameraRoll } from 'react-native';
import { Observable } from 'rxjs';

type MediaType = 'photo' | 'video';

export const saveToCameraRoll = (uri: string, type: MediaType) => {
  if (!uri) {
    return;
  }

  return Observable.from(CameraRoll.saveToCameraRoll(uri, type));
};
