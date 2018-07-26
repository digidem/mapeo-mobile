// @flow
import type { Observation, Attachment } from './observation';
import type { Category } from './category';
import type { ModalState } from './modal';
import type { DrawerState } from './drawer';
import type { GPSState, GPSFormat } from './gps';
import type { Field } from './field';
import type { ObservationSourceState } from './observationSource';
import type { Device } from './device';
import type { MapState } from './map';

export interface StoreState {
  observations: {
    [id: string]: Observation
  };

  categories: {
    [id: string]: Category
  };

  selectedObservation?: Observation;

  modals: ModalState;

  drawers: DrawerState;

  gps: GPSState;

  fields: {
    [id: string]: Field
  };

  observationSource: ObservationSourceState;

  devices: {
    [id: string]: Device
  };

  selectedDevice?: Device;
  settings: SettingsState;
  map: MapState;

  icons: {
    [id: string]: string
  };

  resizedImages: {
    [uri: string]: string
  };

  attachments: {
    [id: string]: Resource<Attachment>
  };

  presets: string[];
  selectedPreset: string;
}

export type SettingsState = {
  gpsFormat: GPSFormat
};

export type ActionStatus = 'Start' | 'Error' | 'Success';

export interface Action<M, P> {
  type: string;
  status: ActionStatus;
  meta: M;
  payload?: P;
  error?: Error;
}

export type Reducers = {
  start?: (state: StoreState, meta: any) => StoreState,
  success?: (state: StoreState, meta: any, payload: any) => StoreState,
  error?: (state: StoreState, meta: any, error: Error) => StoreState
};

export type ResourceStatus = 'Pending' | 'Success' | 'Failed';

export interface Resource<M> {
  status: ResourceStatus;
  data?: M;
  error?: Error;
}
