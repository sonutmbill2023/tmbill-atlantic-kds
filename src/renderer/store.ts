import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import apiMiddleware from './middlewares/apiMiddleware';
// eslint-disable-next-line import/no-cycle
import createRootReducer from './rootReducer';
import { setPOSsettings } from './config/common';

const rootReducer = createRootReducer();
export type RootState = ReturnType<typeof rootReducer>;

export const sagaMiddleware = createSagaMiddleware();
// const router = routerMiddleware(history);
const middleware = [
  sagaMiddleware,
  apiMiddleware,
  // router,
];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV || '',
);

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

export const configuredStore = (initialState?: RootState) => {
  // Create Store

  if (
    initialState &&
    initialState.masterReducer &&
    initialState.masterReducer['settings']
  ) {
    setPOSsettings(initialState.masterReducer['settings']);
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState,
  });
  return store;
};
export type Store = ReturnType<typeof configuredStore>;
