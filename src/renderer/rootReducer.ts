import { combineReducers } from 'redux';
import masterReducer from './redux/reducers/Master';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';

export default function createRootReducer() {
  return combineReducers({
    // router: connectRouter(history),
    counter: counterReducer,
    masterReducer,
  });
}
