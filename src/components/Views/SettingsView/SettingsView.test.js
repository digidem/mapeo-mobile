import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SettingsView from './SettingsView';
import type { StateProps } from './SettingsView';
import { createObservation } from '../../../mocks/observations';
import { createField } from '../../../mocks/fields';
import { createStyle } from '../../../mocks/map';

describe('SettingsView tests', () => {
  const setGPSFormat = jest.fn();
  const setSelectedStyle = jest.fn();
  const listStyles = jest.fn();
  const style = createStyle();
  const styles = {
    [style.id]: style
  };
  const isFocused = () => true;
  const addListener = () => true;

  beforeEach(() => {
    setGPSFormat.mockReset();
    setSelectedStyle.mockReset();
    listStyles.mockReset();
  });

  test('snapshot', () => {
    const props: StateProps[] = [
      { gpsFormat: 'DD', styles },
      { gpsFormat: 'DDM', styles },
      { gpsFormat: 'DMS', styles },
      { gpsFormat: 'UTM', styles }
    ];

    let tree;
    props.forEach(p => {
      tree = renderer.create(
        <SettingsView
          navigation={{ isFocused, addListener }}
          gpsFormat={p.gpsFormat}
          setGPSFormat={setGPSFormat}
          setSelectedStyle={setSelectedStyle}
          listStyles={listStyles}
          styles={p.styles}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
