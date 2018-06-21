// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import CancelModal from './CancelModal';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';

describe('CancelModal tests', () => {
  test('snapshots', () => {
    const onContinue = jest.fn();
    const onCancel = jest.fn();
    const visible = true;

    let tree;
    tree = renderer
      .create(
        <CancelModal
          onContinue={onContinue}
          onCancel={onCancel}
          visible={visible}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
