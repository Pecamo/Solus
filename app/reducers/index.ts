import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import mic, { MicState } from './mic';
import osType, { OsTypeState } from './osType';

const rootReducer = combineReducers({
  mic,
  osType,
  routing: routing as Reducer<any>
});

export interface IState {
  mic: MicState;
  osType: OsTypeState;
}

export default rootReducer;
