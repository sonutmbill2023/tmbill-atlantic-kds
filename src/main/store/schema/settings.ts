import { Schema } from 'electron-store';

export type Settings = {
  id: number;
  title: string;
  value: string;
};

export type StoreSchemaType = {
  settings: Settings[];
};

export const SCHEMA: Schema<StoreSchemaType> = {
  settings: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
      required: ['id', 'title', 'value'],
    },
  },
};
