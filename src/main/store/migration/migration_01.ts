import { Settings, StoreSchemaType } from '../schema/settings';

const KOT_COLOR_SETTINGS = {
  'time-elpased-interval-1': {
    color: '#006400',
    from: 0,
    to: 5,
    index: 1,
  },
  'time-elpased-interval-2': { color: '#dba800', from: 5, to: 10, index: 2 },
  'time-elpased-interval-3': { color: '#d20709d1', from: 10, to: 15, index: 3 },
};

const defaultSettings: Settings[] = [
  {
    id: 1,
    title: 'KOT Color Settings',
    value: JSON.stringify(KOT_COLOR_SETTINGS),
  },
];

export function migration_01(store: any) {
  try {
    store.set('settings', defaultSettings);
  } catch (error) {}
}
