import { Socket } from 'socket.io-client';
import { ipcMain } from 'electron';
import { SOCKET_IO_EVENTS } from '../../constant/IPCEvents';

type ICachedKeys = {
  token: string;
  url: string;
  tokenExpired: boolean;
};

let cachedKeys: ICachedKeys | undefined;
let socketIOClient: Socket | undefined;

ipcMain.on(SOCKET_IO_EVENTS.INIT_SOCKET, (_event, args) => {
  if (args && args.length) {
    const receivedKeys = args[0] as ICachedKeys;
    // console.log({ receivedKeys, cachedKeys });

    if (!cachedKeys) {
      cachedKeys = receivedKeys;
    } else {
      if (receivedKeys.tokenExpired) {
        console.log(`Message="SocketIO token expired. Disconnecting"`);
        // Destory SocketIO Instance
        if (socketIOClient) {
          socketIOClient.disconnect();
        }
        cachedKeys = undefined;
        return;
      }
      if (receivedKeys.token !== cachedKeys.token) {
        cachedKeys = receivedKeys;
        // Restart the SocketIO Connection
        console.log(`Message="SocketIO token expired. Initiate reconnection"`);
      } else {
        console.log(`Message="Reusing the cached Keys for SocketIO"`);
      }
    }
  }
});
