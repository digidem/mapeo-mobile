import { combineEpics } from 'redux-observable';
import observations from './observations';

const rootEpics = combineEpics(...observations);

export default rootEpics;
