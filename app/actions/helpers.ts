import { Action } from 'redux';

export interface IAction extends Action {}
export interface IActionWithPayload<T> extends IAction {
  readonly payload: T;
}

export interface IActionCreator<T> {
  readonly type: string;
  (payload: T): IActionWithPayload<T>;

  test(action: IAction): action is IActionWithPayload<T>;
}

export interface IActionCreatorVoid {
  readonly type: string;
  (): IAction;

  test(action: IAction): action is IAction;
}

export const actionCreator = <T>(type: string): IActionCreator<T> =>
  Object.assign((payload: T): any => ({ type, payload }), {
    type,
    test(action: IAction): action is IActionWithPayload<T> {
      return action.type === type;
    }
  });

export const actionCreatorVoid = (type: string): IActionCreatorVoid =>
  Object.assign((): any => ({ type }), {
    type,
    test(action: IAction): action is IAction {
      return action.type === type;
    }
  });

type suffix = 'REQUEST' | 'PRESUCCESS' | 'SUCCESS' | 'PREFAILURE' | 'FAILURE';

export const makeActions = <T1 extends IActionCreator<any> | IActionCreatorVoid,
  T2 extends IActionCreator<any> | IActionCreatorVoid,
  T3 extends IActionCreator<any> | IActionCreatorVoid,
  T4 extends IActionCreator<any> | IActionCreatorVoid,
  T5 extends IActionCreator<any> | IActionCreatorVoid>(
  actionString: string,
  actionCreators: { [key in suffix]: (baseString: string) => (IActionCreator<any> | IActionCreatorVoid) }) => {
  return {
    REQUEST: actionCreators.REQUEST(`${actionString}_REQUEST`) as T1,
    PRESUCCESS: actionCreators.PRESUCCESS(`${actionString}_PRESUCCESS`) as T2,
    SUCCESS: actionCreators.SUCCESS(`${actionString}_SUCCESS`) as T3,
    PREFAILURE: actionCreators.PREFAILURE(`${actionString}_PREFAILURE`) as T4,
    FAILURE: actionCreators.FAILURE(`${actionString}_FAILURE`) as T5
  };
};
