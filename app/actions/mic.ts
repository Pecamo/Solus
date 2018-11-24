import { actionCreator, actionCreatorVoid, IActionCreator, IActionCreatorVoid, makeActions } from './helpers';
import { IToastProps } from '@blueprintjs/core';

export const micActions = makeActions<
  IActionCreator<string>,
  IActionCreator<string>,
  IActionCreator<string>,
  IActionCreator<string>,
  IActionCreator<string>>('MIC_IDK', {
    REQUEST: s => actionCreatorVoid(s),
    PRESUCCESS: s => actionCreator(s),
    SUCCESS: s => actionCreator(s),
    PREFAILURE: s => actionCreator(s),
    FAILURE: s => actionCreator(s)
  });

export const mic2Actions = makeActions<
    IActionCreator<string>,
    IActionCreator<string>,
    IActionCreator<string>,
    IActionCreator<string>,
    IActionCreator<string>>('MIC_IDK_2', {
      REQUEST: s => actionCreatorVoid(s),
      PRESUCCESS: s => actionCreator(s),
      SUCCESS: s => actionCreator(s),
      PREFAILURE: s => actionCreator(s),
      FAILURE: s => actionCreator(s)
    });

export const toastShowAction = actionCreator<IToastProps>('TOAST_SHOW_ACTION');
