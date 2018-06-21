// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SyncedModal from './SyncedModal';

describe('SyncedModal tests', () => {
  test('snapshots', () => {
    const onContinue = jest.fn();
    const visible = true;

    let tree;
    tree = renderer
      .create(<SyncedModal onContinue={onContinue} visible={visible} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
