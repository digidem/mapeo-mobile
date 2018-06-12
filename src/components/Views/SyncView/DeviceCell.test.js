// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import DeviceCell from './DeviceCell';
import { createDevice } from '../../../mocks/devices';

describe('DeviceCell tests', () => {
  const device = createDevice();
  const onPress = jest.fn();

  test('snapshot', () => {
    const tree = renderer.create(
      <DeviceCell onPress={onPress} device={device} />
    );
    expect(tree).toMatchSnapshot();
  });
});
