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
  const style = createStyle();
  const styles = {
    [style.id]: style
  };

  beforeEach(() => {
    setGPSFormat.mockReset();
    setSelectedStyle.mockReset();
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
          navigation={createNavigationScreenProp()}
          gpsFormat={p.gpsFormat}
          setGPSFormat={setGPSFormat}
          setSelectedStyle={setSelectedStyle}
          styles={p.styles}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
