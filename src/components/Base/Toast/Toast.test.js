// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Toast from './Toast';
import { createObservation } from '../../../mocks/observations';

describe('Toast tests', () => {
  test('snapshots', () => {
    const children = null;
    const onRequestClose = jest.fn();
    const onHide = jest.fn();

    const props = [{ children }];

    let tree;
    props.forEach(p => {
      tree = renderer
        .create(
          <Toast
            children={p.children}
            onRequestClose={onRequestClose}
            onHide={onHide}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
