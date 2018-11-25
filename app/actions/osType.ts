import { actionCreator } from './helpers';

export const osTypeAction = actionCreator<string>('OS_TYPE');
export const currentProcessAction = actionCreator<string>('CURRENT_PROCESS');
