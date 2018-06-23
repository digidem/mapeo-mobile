import type { Style } from '../types/map';

export const createStyle = (partial: Object): Style => ({
    id: 'test-style',
    name: 'Test Style',
    bound: [1, 2, 3, 4],
    minzoom: 7,
    maxzoom: 8,

    ...partial
  });
