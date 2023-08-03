import React from 'react';
import {
  ORDER_EVENTS as ORDER_WSEVENTS,
  KDS_EVENTS,
} from '../../constants/constants';
import { useEvent } from '../../SocketIOhooks';

type Props = {
  getCurrenttablesdata(message?: string, event?: any): void;
};

export default function SIOClientcomponent({ getCurrenttablesdata }: Props) {
  useEvent(ORDER_WSEVENTS.BILL_SETTLED, (_data) => {
    getCurrenttablesdata('Bill settled');
  });

  useEvent(ORDER_WSEVENTS.KOT_SAVED, (_data) => {
    getCurrenttablesdata('KOT Saved');
  });

  useEvent(KDS_EVENTS.ITEM_STATUS_CHANGED, (_data) => {
    getCurrenttablesdata('Item status changed');
  });

  useEvent(KDS_EVENTS.KOT_UPDATED, (data) => {
    getCurrenttablesdata('KOT status updated from KDS', {
      ...data,
      event: KDS_EVENTS.KOT_UPDATED,
    });
  });

  useEvent(ORDER_WSEVENTS.KOT_UPDATED, (data) => {
    console.log(data);
    getCurrenttablesdata('KOT Updated', {
      ...data,
      event: ORDER_WSEVENTS.KOT_UPDATED,
    });
  });

  useEvent(ORDER_WSEVENTS.MESSAGE, (data) => {
    getCurrenttablesdata(data);
  });

  useEvent(KDS_EVENTS.ITEM_STATUS_CHANGED, (data) => {
    getCurrenttablesdata();
  });

  return <div style={{ display: 'none' }}>Hello</div>;
}
