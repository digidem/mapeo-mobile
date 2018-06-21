import { combineEpics } from 'redux-observable';
import categories from './categories';
import observations from './observations';
import fields from './fields';
import devices from './devices';

const rootEpics = combineEpics(
  ...categories,
  ...devices,
  ...observations,
  ...fields
);

export default rootEpics;
