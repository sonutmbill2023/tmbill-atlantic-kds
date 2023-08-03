import { notification } from 'antd';

type Notificationparams = {
  message: string;
  icon: 'info' | 'success' | 'warning' | 'error';
  description?: string;
};
const showNotification = ({
  message,
  icon,
  description,
}: Notificationparams) => {
  notification[icon]({
    message,
    description,
    placement: 'bottomRight',
    className: 'custom-ant-notificaion',
  });
};

// eslint-disable-next-line import/prefer-default-export
export { showNotification };
