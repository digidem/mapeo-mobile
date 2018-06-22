// @flow
import type { Style } from '../types/map';

export const applyStyleDefaults = (partial: Object): Style => ({
  bounds: [-122.339973, 37.742214, -122.150116, 37.856694],
  minzoom: 0,
  maxzoom: 22,

  ...partial
});
