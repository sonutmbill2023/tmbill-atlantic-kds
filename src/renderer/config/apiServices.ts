import { useQuery } from 'react-query';
import {
  IPOSCategory,
  IPOSItem,
  IPOSMenuResponse,
  IPOSMenuUpdate,
} from '../types/menu';
import { Links } from './common';
import apiCall from './../services/api';

type IGetCatalouge = {
  store_id: string;
};

type ICategories = {
  [key: number]: IPOSCategory & {
    items?: IPOSItem[];
  };
};

async function mapMenuforstocksettings(response: IPOSMenuResponse | undefined) {
  try {
    if (response && response.data) {
      const categories: ICategories = {};
      const currentCategories = response.data?.categories || [];
      const currentItems = response.data?.items || [];
      for (const iterator of currentCategories) {
        if (iterator.category_refid) {
          Object.assign(categories, {
            [iterator.category_refid]: {
              ...iterator,
            },
          });
        }
      }

      for (const item of currentItems) {
        const categoryId = Number(item.category_ref_ids);
        if (categories[categoryId]) {
          if (!categories[categoryId].items) {
            categories[categoryId].items = [item];
          } else if (
            categories[categoryId].items &&
            categories[categoryId].items?.length
          ) {
            categories[categoryId].items?.push(item);
          }
        }
      }

      Object.assign(response.data, {
        itemmapeedCategories: categories,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export function usegetCatalouge({ store_id }: IGetCatalouge) {
  return useQuery(
    'GET_CATALOUGE',
    async () => {
      const { data }: { data: IPOSMenuResponse | undefined } =
        await apiCall.get(Links.GET_CATALOUGE, {
          params: {
            store_id: store_id,
          },
          headers: {
            Authorization: `Bearer ${Links.TOKEN}`,
          },
        });
      await mapMenuforstocksettings(data);
      return data;
    },
    { enabled: false }
  );
}

export async function updateCatalouge(payload: IPOSMenuUpdate) {
  try {
    const { data } = await apiCall.patch(Links.UPDATE_CATALOUGE, payload, {
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
