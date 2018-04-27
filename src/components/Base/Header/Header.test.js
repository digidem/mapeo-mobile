// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Header from './Header';
import { createObservation } from '../../../mocks/observations';

describe('Header tests', () => {
  test('snapshot without triangle prop', () => {
    const tree = renderer.create(<Header />);
    expect(tree).toMatchSnapshot();
  });

  test('snapshot with triangle prop', () => {
    const tree = renderer.create(<Header showTriangle />);
    expect(tree).toMatchSnapshot();
  });
});
