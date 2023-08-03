import React, { useImperativeHandle, useEffect, forwardRef } from 'react';
import socketIOClient from 'socket.io-client';
import { Links } from '../../config/common';
import { ORDER_EVENTS, KDS_EVENTS } from '../../constants/constants';

type ComponentProps = {
  getCurrenttablesdata(message: string): void;
};

type ComponentdownHandle = {
  sendSocketevent: (vent: string) => void;
};

// const SIOClientcomponentnew: React.ForwardRefRenderFunction<
//   ComponentdownHandle,
//   ComponentProps
// > = ({ getCurrenttablesdata }: ComponentProps, ref) => {
//   useImperativeHandle(ref, () => ({
//     sendSocketevent(event) {
//       console.log({ event });
//     },
//   }));

//   useEffect(() => {
//     const currentSocketinstance: SocketIOClient.Socket = socketIOClient(
//       `${Links.SERVER_API_URL}?token=${Links.TOKEN}`
//     );

//     const refreshView = (message: string) => {
//       getCurrenttablesdata(message);
//     };

//     if (currentSocketinstance) {
//       currentSocketinstance.on(ORDER_EVENTS.BILL_SETTLED, () => {
//         refreshView('Bill settled');
//       });

//       currentSocketinstance.on(ORDER_EVENTS.KOT_SAVED, () => {
//         refreshView('New KOT Placed');
//       });

//       currentSocketinstance.on(ORDER_EVENTS.KOT_UPDATED, () => {
//         refreshView('Old KOT updated');
//       });

//       currentSocketinstance.on(KDS_EVENTS.KOT_UPDATED, () => {
//         refreshView('KOT updated');
//       });

//       currentSocketinstance.on(KDS_EVENTS.ITEM_STATUS_CHANGED, () => {
//         refreshView('KOT item status updated');
//       });
//     }
//     // CLEAN UP THE EFFECT
//     return () => {
//       if (currentSocketinstance) currentSocketinstance.disconnect();
//     };
//     //
//   }, [getCurrenttablesdata]);

//   return <div style={{ display: 'none' }}>Hello</div>;
// };

const SIOClientcomponentnew = forwardRef(
  ({ getCurrenttablesdata }: ComponentProps, ref) => {
    const currentSocketinstance: SocketIOClient.Socket = socketIOClient(
      `${Links.SERVER_API_URL}?token=${Links.TOKEN}`
    );

    useEffect(() => {
      const refreshView = (message: string) => {
        getCurrenttablesdata(message);
      };

      if (currentSocketinstance) {
        currentSocketinstance.on(ORDER_EVENTS.BILL_SETTLED, () => {
          refreshView('Bill settled');
        });

        currentSocketinstance.on(ORDER_EVENTS.KOT_SAVED, () => {
          refreshView('New KOT Placed');
        });

        currentSocketinstance.on(ORDER_EVENTS.KOT_UPDATED, () => {
          refreshView('Old KOT updated');
        });

        currentSocketinstance.on(KDS_EVENTS.KOT_UPDATED, () => {
          refreshView('KOT updated');
        });

        currentSocketinstance.on(KDS_EVENTS.ITEM_STATUS_CHANGED, () => {
          refreshView('KOT item status updated');
        });
      }
      // CLEAN UP THE EFFECT
      return () => {
        if (currentSocketinstance) currentSocketinstance.disconnect();
      };
      //
    }, []);

    useImperativeHandle(ref, () => ({
      sendBroadcastrequest(eventName: string) {
        if (currentSocketinstance) {
          currentSocketinstance.emit(eventName);
        }
      },
    }));
    return <div style={{ display: 'none' }}>Hello</div>;
  }
);
SIOClientcomponentnew.displayName = 'SIOClientcomponentnew';

export default SIOClientcomponentnew;
// export default forwardRef(SIOClientcomponentnew);
