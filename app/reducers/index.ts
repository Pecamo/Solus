import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import mic, { MicState } from './mic';
import osType, { OsTypeState } from './osType';
import currentProcess, { CurrentProcessState } from './currentProcess';

const rootReducer = combineReducers({
  mic,
  osType,
  currentProcess,
  routing: routing as Reducer<any>
});

export interface IState {
  mic: MicState;
  osType: OsTypeState;
  currentProcess: CurrentProcessState;
}

export default rootReducer;
