import { IKeyBasedSettings } from '../types/Settings';

/* eslint-disable @typescript-eslint/no-explicit-any */
let baseURL = '';

export const SERVER_API_URL = baseURL;

// eslint-disable-next-line import/no-mutable-exports
export let CURRENT_CURRENCY_SYMBOL = '₹';

export const ROUNDOFF_UPTO = 2;

// eslint-disable-next-line import/no-mutable-exports
export let STORE_SETTINGS: any;

export let POS_SETTINGS: IKeyBasedSettings | undefined = undefined;

export function setCurrency(currency: string) {
  CURRENT_CURRENCY_SYMBOL = currency || '₹';
}

export function setStoresettings(outlet: any) {
  if (outlet && outlet.digital_ordering_settings) {
    STORE_SETTINGS = outlet.digital_ordering_settings;
    STORE_SETTINGS.todays_date = outlet.todays_date;
    STORE_SETTINGS.order_later_days_limit = outlet.order_later_days_limit;
  }
}

export function setPOSsettings(setting: IKeyBasedSettings) {
  POS_SETTINGS = setting;
}

export const Links = {
  TOKEN: '',
  SERVER_API_URL: '',
  API_LOGIN: ``,
  API_RUNNINGTABLES: ``,
  API_UPDATE_KOTSTATUS: ``,
  API_UPDATE_ORDERKOTSTATUS: ``,
  API_UPDATE_KOTITEMSTATUS: ``,
  API_SETTLE_ALL: '',
  GET_CATALOUGE: '',
  UPDATE_CATALOUGE: '',
};

function reinitLinks(passedURL: string) {
  Links.SERVER_API_URL = passedURL;
  Links.API_LOGIN = `${passedURL}login`;
  Links.API_RUNNINGTABLES = `${passedURL}api/kds/runningtables`;
  Links.API_UPDATE_KOTSTATUS = `${passedURL}api/kds/kot`;
  Links.API_SETTLE_ALL = `${passedURL}api/kds/settleall`;
  Links.API_UPDATE_ORDERKOTSTATUS = `${passedURL}api/kds/orderkot`;
  Links.API_UPDATE_KOTITEMSTATUS = `${passedURL}api/kds/kotitem`;
  Links.GET_CATALOUGE = `${passedURL}api/kds/menu`;
  Links.UPDATE_CATALOUGE = `${passedURL}api/kds/setCategoryActiveStatus`;
}
export function setBaseurl(params: string) {
  baseURL = params || SERVER_API_URL;
  reinitLinks(baseURL);
  console.log(baseURL, 'setBAseURL');
}
