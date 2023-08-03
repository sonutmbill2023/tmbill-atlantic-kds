import Bonjour, { Service } from 'bonjour-service';
import { BrowserWindow, ipcMain } from 'electron';
import { IPC_SERVICE_DISCOVERY } from '../../constant/IPCEvents';

let bonjour: Bonjour | undefined;

let discoveredStores: { [key: string]: Service } = {};

bonjour = new Bonjour();

let retryScancount = 0;

let mainbrowserWindow: BrowserWindow | null | undefined = undefined;
type BonjurService = Service & {
  name?: string;
  referer?: any;
  txt?: any;
  addresses?: any;
};

function sendStorestorenderer() {
  if (mainbrowserWindow) {
    mainbrowserWindow.webContents.send(IPC_SERVICE_DISCOVERY.GET_LIST, {
      discoveredIps: Object.keys(discoveredStores),
      serversList: Object.values(discoveredStores),
    });
  }
}

function retryBonjour() {
  if (Object.values(discoveredStores).length === 0 && retryScancount <= 5) {
    retryScancount = retryScancount + 1;
    const retryingAfter = (retryScancount + 1) * 1000;
    console.log(
      `Message="Recanning For Bonjur Services after ${retryingAfter}ms"`
    );
    setTimeout(() => {
      discoveredStores = {};
      initBonjour(mainbrowserWindow);
    }, retryScancount * 1000);
  } else {
    setTimeout(sendStorestorenderer, 5000);
  }
}
export function initBonjour(browserWindow?: BrowserWindow | null | undefined) {
  browserWindow = mainbrowserWindow;
  if (bonjour) {
    console.log(`Message="Scanning For Bonjur Services"`);
    bonjour.find({ type: 'http' }, (service: BonjurService) => {
      if (
        String(service.name).includes('TMBill Altantic') &&
        service.txt !== undefined &&
        service.addresses &&
        service.addresses.length > 0 &&
        service.referer &&
        service.referer.address
      ) {
        Object.assign(discoveredStores, {
          [service.txt.storeName]: service,
        });
      }

      setTimeout(sendStorestorenderer, 5000);
    });
  }
}

ipcMain.on(IPC_SERVICE_DISCOVERY.GET_LIST, async (event, arg) => {
  retryScancount = 0;
  initBonjour(mainbrowserWindow);
});

export function setBrowserwindow(
  browserWindow: BrowserWindow | null | undefined
) {
  mainbrowserWindow = browserWindow;
}
export function test() {}
