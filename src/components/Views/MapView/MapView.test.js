// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import MapView from './MapView';

jest.mock('../ObservationsView', () => () => null);
jest.mock('./Map', () => () => null);
jest.mock('../../Base/SavedModal', () => () => null);

describe('MapView tests', () => {
  test('snapshots', () => {
    const props = [{ showSavedModal: true }, { showSavedModal: false }];

    let tree;
    props.forEach(p => {
      tree = shallow(<MapView showSavedModal={p.showSavedModal} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
