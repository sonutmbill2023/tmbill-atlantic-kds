import { INTERVALS } from './../components/Settings/misc/SettingsUtils';
import { ELASPED_TIME_SETTINGS } from '../components/Settings/misc/SettingsUtils';
import { setBaseurl, Links } from '../config/common';

// eslint-disable-next-line import/prefer-default-export
export function postprocessLoadstate(state: any) {
  if (state && state.masterReducer && state.masterReducer.miscData) {
    const { miscData, userDetails } = state.masterReducer;
    if (miscData.baseUrl) {
      setBaseurl(miscData.baseUrl);
    }
    if (userDetails.token) {
      Links.TOKEN = userDetails.token;
    }
  }
}

function validateNum(input: string, min: number, max: number) {
  const num = +input;
  return num >= min && num <= max && input === num.toString();
}

export function validateIpAndPort(input: string) {
  const parts = input.split(':');
  const ip = parts[0].split('.');
  const port = parts[1];
  return (
    validateNum(port, 1, 65535) &&
    ip.length === 4 &&
    ip.every((segment) => {
      return validateNum(segment, 0, 255);
    })
  );
}

export function diffHours(dt2: Date, dt1: Date) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

export function diffMinutes(dt2: Date, dt1: Date) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export function gettimeelapsedClass(minutes: number) {
  let className = 'time-elpased';
  if (minutes <= 5) {
    className = INTERVALS.FIRST;
  } else if (minutes >= 6 && minutes <= 10) {
    className = INTERVALS.SECOND;
  } else if (minutes >= 11) {
    className = INTERVALS.THIRD;
  }

  if (ELASPED_TIME_SETTINGS && Object.keys(ELASPED_TIME_SETTINGS).length > 0) {
    if (
      ELASPED_TIME_SETTINGS[INTERVALS.FIRST] &&
      minutes >= ELASPED_TIME_SETTINGS[INTERVALS.FIRST].from &&
      minutes <= ELASPED_TIME_SETTINGS[INTERVALS.FIRST].to
    ) {
      className = INTERVALS.FIRST;
      // console.log(`In the 1st Interval`);
    } else if (
      ELASPED_TIME_SETTINGS[INTERVALS.SECOND] &&
      minutes >= ELASPED_TIME_SETTINGS[INTERVALS.SECOND].from &&
      minutes <= ELASPED_TIME_SETTINGS[INTERVALS.SECOND].to
    ) {
      className = INTERVALS.SECOND;
      // console.log(`In the 2nd Interval`);
    } else if (
      ELASPED_TIME_SETTINGS[INTERVALS.THIRD] &&
      minutes >= ELASPED_TIME_SETTINGS[INTERVALS.THIRD].from
    ) {
      className = INTERVALS.THIRD;
      // console.log(`In the 3rd Interval`);
    }
  }

  return className;
}

export const sortBy = (key: string) => {
  return (a: any, b: any) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};

export const nativekeyBy = (array: any[], key: string) =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

const collectionKeyBy = (collection: any, key: string) => {
  const c = collection || {};
  return c.isArray() ? nativekeyBy(c, key) : nativekeyBy(Object.values(c), key);
};
