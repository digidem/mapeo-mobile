// @flow
import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import CameraView from './CameraView';
import { createNavigationScreenProp } from '../../../mocks/navigation';

jest.mock('../ObservationsView', () => () => null);
jest.mock('../MapView', () => () => null);
jest.mock('../../Base/SavedModal', () => () => null);

describe('CameraView tests', () => {
  const isFocused = () => true;
  const addListener = () => true;
  test('snapshots', () => {
    let tree;
    tree = shallow(
      <CameraView
        navigation={createNavigationScreenProp()}
        observations={{}}
        showSavedModal={false}
        showEditorView={false}
        createObservation={jest.fn()}
        updateObservation={jest.fn()}
        onDrawerClose={jest.fn()}
        onDrawerOpen={jest.fn()}
        updateObservationSource={jest.fn()}
        saveMedia={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
