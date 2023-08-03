import { all } from 'redux-saga/effects';
import menu from './Store';

export default function* root() {
  yield all([menu()]);
}
