import { all, call } from 'redux-saga/effects';

import authSaga from '@modules/auth/saga';
import assetSaga from '@modules/asset/saga';

/**
 * Root saga
 * @returns {IterableIterator<AllEffect | GenericAllEffect<any> | *>}
 */
export default function* rootSaga() {
  yield all([call(authSaga), call(assetSaga)]);
}
