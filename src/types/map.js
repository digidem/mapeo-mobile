// @flow

export interface MapState {
  styles: { [id: string]: Style };
  selectedStyle: Style;
}

export interface Style {
  id: string;
  name: string;
  bounds: number[];
  minzoom: number;
  maxzoom: number;
}
