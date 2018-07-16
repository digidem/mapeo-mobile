// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Header from './Header';
import { createObservation } from '../../../mocks/observations';
import { createGPSState } from '../../../mocks/gps';

jest.mock('../../../ducks/gps', () => ({
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNAVAILABLE: 'UNAVAILABLE',
  SEARCHING: 'SEARCHING',
  LOW_ACCURACY: 'LOW_ACCURACY',
  HIGH_ACCURACY: 'HIGH_ACCURACY'
}));

describe('Header tests', () => {
  const gps = createGPSState();

  test('snapshot without triangle prop', () => {
    const tree = renderer.create(<Header gps={gps} leftIcon="" rightIcon="" />);
    expect(tree).toMatchSnapshot();
  });

  test('snapshot with triangle prop', () => {
    const tree = renderer.create(
      <Header showTriangle gps={gps} leftIcon="" rightIcon="" />
    );
    expect(tree).toMatchSnapshot();
  });
});
