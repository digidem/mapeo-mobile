import { combineEpics } from 'redux-observable';
import observations from './observations';
import devices from './devices';
import map from './map';
import media from './media';
import presets from './presets';

const rootEpics = combineEpics(
  ...devices,
  ...observations,
  ...map,
  ...media,
  ...presets
);

export default rootEpics;
