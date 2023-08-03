import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import throttle from 'lodash/throttle';
import { configuredStore, sagaMiddleware } from './store';
import { loadState, saveState } from './storage';
import Root from './containers/Root';
import { postprocessLoadstate } from './utils/MiscUtils';
import sagas from './saga';
import './App.global.css';
import './css/common.global.css';

const queryClient = new QueryClient();

const state = loadState();
postprocessLoadstate(state);
const store = configuredStore(state);
sagaMiddleware.run(sagas);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root')!;
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <Root store={store} />
    </QueryClientProvider>,
  );
});

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 2000),
);
