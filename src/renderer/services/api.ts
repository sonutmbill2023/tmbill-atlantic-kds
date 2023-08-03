import axios from 'axios';
import { showNotification } from '../components/Antnotify';

const api = axios.create();

api.defaults.headers['content-type'] = 'application/json';

api.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    // console.log(err);

    const { data, status } = err.response;
    if (status !== undefined) {
      if (status === 500 || status === 502) {
        showNotification({ icon: 'error', message: 'Something went wrong' });
      } else if (status === 401) {
        showNotification({
          icon: 'error',
          message: 'Session expired.Please login again.',
        });
      } else if (status === 400) {
        showNotification({
          icon: 'error',
          message: data.message || data.response || 'No data found !',
        });
      }
    }
    // console.log(data);
    throw err;
  }
);

export default api;
