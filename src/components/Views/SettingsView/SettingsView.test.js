// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SettingsView from './SettingsView';
import type { StateProps } from './SettingsView';
import { createObservation } from '../../../mocks/observations';
import { createField } from '../../../mocks/fields';
import { createStyle } from '../../../mocks/map';
import { createNavigationScreenProp } from '../../../mocks/navigation';

describe('SettingsView tests', () => {
  const setGPSFormat = jest.fn();
  const setSelectedStyle = jest.fn();
  const setSelectedPreset = jest.fn();
  const style = createStyle();
  const styles = {
    [style.id]: style
  };
  const presets = ['presets0', 'presets1'];

  beforeEach(() => {
    setGPSFormat.mockReset();
    setSelectedStyle.mockReset();
    setSelectedPreset.mockReset();
  });

  test('snapshot', () => {
    const props: StateProps[] = [
      { gpsFormat: 'DD', styles, presets, selectedPreset: presets[0] },
      { gpsFormat: 'DDM', styles, presets, selectedPreset: presets[0] },
      { gpsFormat: 'DMS', styles, presets, selectedPreset: presets[0] },
      { gpsFormat: 'UTM', styles, presets, selectedPreset: presets[0] }
    ];

    let tree;
    props.forEach(p => {
      tree = renderer.create(
        <SettingsView
          navigation={createNavigationScreenProp()}
          gpsFormat={p.gpsFormat}
          setGPSFormat={setGPSFormat}
          setSelectedStyle={setSelectedStyle}
          styles={p.styles}
          presets={p.presets}
          selectedPreset={p.selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
