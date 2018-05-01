// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationHeader from './ObservationHeader';

describe('ObservationHeader tests', () => {
  const closeRightDrawer = jest.fn();

  beforeEach(() => {
    closeRightDrawer.mockReset();
  });

  test('snapshot with showSyncTip as true', () => {
    const tree = renderer.create(
      <ObservationHeader closeRightDrawer={closeRightDrawer} showSyncTip />
    );
    expect(tree).toMatchSnapshot();
  });

  test('snapshot with showSyncTip as false', () => {
    const tree = renderer.create(
      <ObservationHeader
        closeRightDrawer={closeRightDrawer}
        showSyncTip={false}
      />
    );
    expect(tree).toMatchSnapshot();
  });

  test('should call the closeRightDrawer function when the left chevron is pressed', () => {
    const tree = shallow(
      <ObservationHeader
        closeRightDrawer={closeRightDrawer}
        showSyncTip={false}
      />
    );
    tree
      .find('TouchableOpacity')
      .first()
      .props()
      .onPress();
    expect(closeRightDrawer).toHaveBeenCalled();
  });
});
