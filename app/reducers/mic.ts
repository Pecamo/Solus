import { IAction } from '../actions/helpers';
import { micActions, mic2Actions } from '../actions/mic';

export type MicState = {
  idk: string;
};

const initialState: MicState = {
  idk: 'something lul'
};

export default function phones(state: MicState = initialState, action: IAction): MicState {
  if (micActions.SUCCESS.test(action)) {
    const newState = { idk: 'something else LUL' };
    // Logic maybe
    return newState;
  }

  if (mic2Actions.SUCCESS.test(action)) {
    const newState = { idk: 'something else ELSE LUL' };
    // Logic maybe
    return newState;
  }

  return state;
}
