// @flow

export const createDevice = (device?: any) => ({
  id: '0',
  name: 'deviceName',
  selected: false,
  syncStatus: 'notStarted',

  ...device
});
