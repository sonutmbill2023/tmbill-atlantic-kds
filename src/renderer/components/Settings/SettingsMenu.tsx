import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const settingsMenuitems: MenuProps['items'] = [
  getItem('Dashboard', 'home', undefined),
  { type: 'divider' },
  getItem('Stock', 'settings/category', undefined),
  { type: 'divider' },
  getItem('Settings', 'settings/general', undefined),
];
