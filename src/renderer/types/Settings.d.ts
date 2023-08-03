export type ISettings = {
  id: number;
  title: string;
  value: string;
};

type IKeyBasedSettings = {
  [key: number]: ISettings;
};
