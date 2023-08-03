/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable func-names */
import axios from 'axios';

// eslint-disable-next-line consistent-return
const apiMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.method && action.method === 'POST' && action.url) {
    axios
      .post(action.url, action.data)
      .then((response) => {
        // eslint-disable-next-line promise/no-callback-in-promise
        return next({
          type: action.type,
          payload: response,
        });
      })
      .catch(function (error) {
        return next({
          type: action.type,
          payload: error.response,
        });
      });
  } else if (action.method && action.method === 'DELETE' && action.url) {
    axios
      .delete(action.url)
      .then((response) => {
        return next({
          type: action.type,
          payload: response,
        });
      })
      .catch((err) => {
        return next({
          type: action.type,
          payload: err,
        });
      });
  } else if (action.url) {
    axios
      .get(action.url)
      .then((response) => {
        return next({
          type: action.type,
          payload: response,
        });
      })
      .catch((err) => {
        return next({
          type: action.type,
          payload: err,
        });
      });
  }
  // Skip axios for passing data from child component to parent component
  else {
    return next({
      type: action.type,
      payload: action.payload,
    });
  }
};

export default apiMiddleware;
