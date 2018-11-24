import { IAction } from '../actions/helpers';
import { osTypeAction } from '../actions/osType';

export type OsTypeState = string;

const initialState: OsTypeState = 'Linux';

export default function osType(state: OsTypeState = initialState, action: IAction): OsTypeState {
  if (osTypeAction.test(action)) {
    return action.payload;
  }

  return state;
}
