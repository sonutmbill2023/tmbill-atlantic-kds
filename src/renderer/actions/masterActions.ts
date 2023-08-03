import { API_LOGIN } from '../config/api';

export const updateorderStatus = (data: any) => {
  const payload = {
    type: 'VE',
    url: 'API_UPDATEORDER_STATUS',
    data: {
      store_id: data.store_id,
      order_id: data.order_id,
      new_order_state: data.new_order_state,
      phone: data.phone,
    },
    method: 'PUT',
  };
  return payload;
};

export const verifyUser = (data: { username: string; password: string }) => {
  const payload = {
    type: 'VERIFY_USER',
    url: API_LOGIN,
    data,
    method: 'POST',
  };
  return payload;
};
