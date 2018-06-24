import { all, call } from 'redux-saga/effects';
import FactionSelectorSaga from './FactionSelector/FactionSelectorSaga';

export default function*() {
    yield all([
        call(FactionSelectorSaga)
    ]);
}