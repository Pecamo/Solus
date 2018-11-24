import { all } from 'redux-saga/effects';
import * as micSaga from './mic';

const injectSagas = (sagas: IterableIterator<any>[], nestedSagas: any) => {
  Object.keys(nestedSagas).map((key) => {
    sagas.push(nestedSagas[key]());
    return nestedSagas[key];
  });
};

export default function* rootSaga() {
  const sagas: IterableIterator<any>[] = [];

  injectSagas(sagas, micSaga);

  yield all(sagas);
}
