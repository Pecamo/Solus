import { IAction } from '../actions/helpers';
import { currentProcessAction } from '../actions/osType';

export type CurrentProcessState = string;

const initialState: CurrentProcessState = 'electron';

export default function osType(state: CurrentProcessState = initialState, action: IAction): CurrentProcessState {
  if (currentProcessAction.test(action)) {
    return action.payload;
  }

  return state;
}
