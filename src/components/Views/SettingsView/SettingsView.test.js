// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SettingsView from './SettingsView';
import type { StateProps } from './SettingsView';
import { createObservation } from '../../../mocks/observations';
import { createField } from '../../../mocks/fields';

describe('SettingsView tests', () => {
  const goBack = jest.fn();
  const setGPSFormat = jest.fn();

  beforeEach(() => {
    goBack.mockReset();
    setGPSFormat.mockReset();
  });

  test('snapshot', () => {
    const props: StateProps[] = [
      { gpsFormat: 'DD' },
      { gpsFormat: 'DDM' },
      { gpsFormat: 'DMS' },
      { gpsFormat: 'UTM' }
    ];

    let tree;
    props.forEach(p => {
      tree = renderer.create(
        <SettingsView
          gpsFormat={p.gpsFormat}
          goBack={goBack}
          setGPSFormat={setGPSFormat}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
