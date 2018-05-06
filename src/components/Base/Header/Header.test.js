// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Header from './Header';
import { createObservation } from '../../../mocks/observations';
import { createGPSState } from '../../../mocks/gps';
import { resourceSuccess } from '../../../lib/resource';

describe('Header tests', () => {
  const gps = resourceSuccess(createGPSState());

  test('snapshot without triangle prop', () => {
    const tree = renderer.create(<Header gps={gps} />);
    expect(tree).toMatchSnapshot();
  });

  test('snapshot with triangle prop', () => {
    const tree = renderer.create(<Header showTriangle gps={gps} />);
    expect(tree).toMatchSnapshot();
  });
});
