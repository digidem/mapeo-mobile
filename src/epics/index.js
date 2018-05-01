import { combineEpics } from 'redux-observable';
import categories from './categories';
import observations from './observations';

const rootEpics = combineEpics(...categories, ...observations);

export default rootEpics;
