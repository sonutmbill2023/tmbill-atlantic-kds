import React from 'react';
import { Provider } from 'react-redux';
import { Store } from '../store';
import Routes from '../Routes';

type Props = {
  store: Store;
};

const Root = ({ store }: Props) => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

export default Root;
