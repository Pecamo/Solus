import { select, put, take, fork, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { ipcRenderer } from 'electron';
import {
  micActions, mic2Actions, toastShowAction
} from '../actions/mic';
import { ToMain, ToRenderer } from '../types/ipcMessages';
import { IAction, IActionCreator, IActionCreatorVoid, IActionWithPayload } from '../actions/helpers';
import { Intent, IToastProps } from '@blueprintjs/core';
import { AppToaster } from '../ui/toaster';
import { IState } from '../reducers';
import { MicState } from '../reducers/mic';
import * as React from 'react';

import { store } from '../index';

const selectMic = (state: IState) => state.mic;

const sagaAndForward = (saga: any, finalActionCreator: IActionCreator<any> | IActionCreatorVoid) => {
  return function* f(action: IAction | IActionWithPayload<any>, ...args: any[]) {
    if (saga) {
      yield* saga(action, ...args);
    }
    if ('payload' in action) {
      yield put((finalActionCreator as IActionCreator<any>)(action.payload));
    } else {
      yield put((finalActionCreator as IActionCreatorVoid)());
    }
  };
};

////////////////////////
//                    //
// Actions forwarders //
//                    //
////////////////////////

/////////////
// REQUEST //

export function* micRequestSaga() {
  yield takeEvery(micActions.REQUEST.type, micRequestHandler);
}
function micRequestHandler(action: ReturnType<typeof micActions.REQUEST>) {
  ipcRenderer.send(ToMain.MIC_IDK, action.payload);
}

////////////////
// PRESUCCESS //

/**
 * Takes every PRESUCCESS and gives it to the worker
 */
export function* micActionsResponseSaga() {
  yield takeEvery(micActions.PRESUCCESS.type, sagaAndForward(micPresuccessWorker, micActions.SUCCESS));
}

////////////
// Others //

export function* toastShowActionSaga() {
  yield takeEvery(toastShowAction.type, toastShowActionWorker);
}

//////////////
//          //
// Handlers //
//          //
//////////////

function* micPresuccessWorker(action: IActionWithPayload<string>) { // TODO : Infer action's type

  // Do some side effects if needed
  yield;

}

function* toastShowActionWorker(action: IActionWithPayload<IToastProps>) { // TODO : Infer action's type
  return AppToaster.show(action.payload);
}
