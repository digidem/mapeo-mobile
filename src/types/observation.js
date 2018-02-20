// @flow

export interface Observation {
  type: string;
  id: string;
  lat: number;
  lon: number;
  link: string;
  created: Date;
  name: string;
  notes: string;
  observedBy: string;
}
