import { ipcMain } from 'electron';
import { SCHEMA, StoreSchemaType } from './schema/settings';
import Store from 'electron-store';
import { STORE_IPC } from '../../constant/IPCEvents';
import { migration_01 } from './migration/migration_01';

export const settingsStore = new Store<StoreSchemaType>({
  schema: SCHEMA || {},
  migrations: {
    '4.6.8': (store) => {
      migration_01(store);
    },
  },
});

console.log(settingsStore.path);

ipcMain.on(STORE_IPC.UPDATE_SETTINGS, async (event, arg) => {
  if (arg && arg.length) {
    settingsStore.set('settings', arg[0]);
  }
  // settingsStore.set('settings', arg);
  // event.reply(STORE_IPC.UPDATE_SETTINGS, settingsStore.get('settings'));
});

ipcMain.on(STORE_IPC.GET_SETTINGS, async (event, arg) => {
  event.reply(STORE_IPC.GET_SETTINGS, settingsStore.get('settings'));
});

ipcMain.on(STORE_IPC.GET_DASH_SETTINGS, async (event, arg) => {
  event.reply(STORE_IPC.GET_DASH_SETTINGS, settingsStore.get('settings'));
});
