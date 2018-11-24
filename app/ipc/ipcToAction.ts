import { ipcRenderer } from 'electron';
import { ToRenderer } from '../types/ipcMessages';
import EventEmitter = Electron.EventEmitter;

import {
  micActions,
  mic2Actions
} from '../actions/mic';
import { osTypeAction } from '../actions/osType';
import { IActionCreator, IActionCreatorVoid } from '../actions/helpers';

export const startIpcListeners = (store: any) => {
  const ipcToActionsForward: {[key: string] : IActionCreator<any> | IActionCreatorVoid} = {
    // Recurring IPC Messages
    [ToRenderer.MIC_IDK_RESULT]: micActions.PRESUCCESS,
    [ToRenderer.MIC_IDK_2_RESULT]: mic2Actions.PRESUCCESS,

    // One time Messages
    [ToRenderer.OS_TYPE]: osTypeAction
  };

  for (const ipcMessage in ipcToActionsForward) {
    const presuccessAction = ipcToActionsForward[ipcMessage];
    ipcRenderer.on(ipcMessage, (event: {sender: EventEmitter}, message: any) => {
      if (message) {
        store.dispatch((presuccessAction as IActionCreator<any>)(message));
      } else {
        store.dispatch((presuccessAction as IActionCreatorVoid)());
      }
    });
  }
};
