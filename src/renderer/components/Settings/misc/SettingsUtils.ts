import { IKeyBasedSettings } from '../../../types/Settings';

export const INTERVALS = {
  FIRST: 'time-elpased-interval-1',
  SECOND: 'time-elpased-interval-2',
  THIRD: 'time-elpased-interval-3',
};

type Props = {
  [key: string]: {
    color: string;
    from: number;
    to: number;
  };
};
export let ELASPED_TIME_SETTINGS: Props = {};

export function initializeSettings(settings: IKeyBasedSettings) {
  try {
    // console.log(settings);
    if (settings && settings[1] && settings[1].value) {
      const values = JSON.parse(settings[1].value);

      let root = document.documentElement;
      if (root) {
        Object.keys(values).forEach((key, index) => {
          root.style.setProperty(`--${key}`, values[key].color);
        });
      }
      setElapsedtimesettings(values);
    }
  } catch (error) {}
}

export function setElapsedtimesettings(settings: any) {
  ELASPED_TIME_SETTINGS = settings;
}
