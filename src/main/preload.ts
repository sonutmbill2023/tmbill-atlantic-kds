import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { BrowserWindow } from 'electron/main';

export type Channels = 'IPC:SERVICE_DISCOVERY:GET_LIST';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeListener(channel: string, callback: any) {
      ipcRenderer.removeListener(channel, callback);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

declare global {
  var currentmainWindow: BrowserWindow | undefined;
}

export type ElectronHandler = typeof electronHandler;
