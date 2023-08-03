import {
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
} from './sessionStorage';

import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
} from './localStorage';

import { setCookie, getCookie, removeCookie } from './jscookie';

const loadState = () => {
  try {
    const serializedState = getLocalStorage('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    setLocalStorage('state', serializedState);
  } catch {
    // ignore write errors
  }
};

export {
  loadState,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  setCookie,
  getCookie,
  removeCookie,
};
