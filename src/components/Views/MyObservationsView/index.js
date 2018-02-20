// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import { values } from 'lodash';
import MyObservationsView from './MyObservationsView';
import type { StateProps } from './MyObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.app.observations).sort(
    (a, b) => b.created - a.created
  );

  return { observations };
}

export default connect(mapStateToProps)(MyObservationsView);
