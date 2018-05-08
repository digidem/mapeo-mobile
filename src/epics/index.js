import { combineEpics } from 'redux-observable';
import categories from './categories';
import observations from './observations';
import fields from './fields';

const rootEpics = combineEpics(...categories, ...observations, ...fields);

export default rootEpics;
