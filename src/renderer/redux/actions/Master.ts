import { MASTER_DISPATCH_EVENTS } from '../../constants/constants';
import {
  Getsettledkotparams,
  KOTItemupdatetypes,
  UpdateorderkotSuccess,
} from '../../types';
import { IKeyBasedSettings } from '../../types/Settings';
import { IRunningtablekotDetail, ISettledOrder } from '../../types/Store';

export function getRunningtable(
  store_id: string,
  status?: string,
  miscParams?: Getsettledkotparams
) {
  return {
    type: MASTER_DISPATCH_EVENTS.GET_RUNNING_TABLES,
    payload: { store_id, status, miscParams },
  };
}

export function setRunningtable(
  runningtablekotDetails: IRunningtablekotDetail[],
  settledOrders?: ISettledOrder[]
) {
  return {
    type: MASTER_DISPATCH_EVENTS.SET_RUNNING_TABLES,
    payload: { runningtablekotDetails, settledOrders },
  };
}

export function verifyUser(params: {
  username: string;
  password: string;
  miscData: any;
  ipaddress: string | undefined;
}) {
  return {
    type: MASTER_DISPATCH_EVENTS.VERIFY_USER,
    payload: { params },
  };
}
type Params = {
  miscData: any;
  storeDetails: any;
  data: any;
  settings: IKeyBasedSettings;
};
export function userVerified({
  miscData,
  storeDetails,
  data,
  settings,
}: Params) {
  return {
    type: MASTER_DISPATCH_EVENTS.USER_VERIFIED,
    payload: { userDetails: data, miscData, storeDetails, settings },
  };
}

export function upadteKOTstatus(params: {
  kot_id: number;
  status: number;
  miscData?: any;
}) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_KOT_STATUS,
    payload: params,
  };
}

export function settleAll(params: {
  kot_id: (number | undefined)[];
  order_id: (string | undefined)[];
  status: string;
  order_status: number;
  miscData?: any;
}) {
  return {
    type: MASTER_DISPATCH_EVENTS.SETTLE_ALL_STATUS,
    payload: params,
  };
}

export function upadteorderKOTstatus(params: {
  order_id: string;
  status: number;
  previousStatus: number;
  miscData?: any;
}) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_STATUS,
    payload: params,
  };
}

export function orderKOTstatusupdated(params: UpdateorderkotSuccess) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_SUCCESS,
    payload: { status: params.status, index: params.miscData.index },
  };
}

export function updatedorderKOTstatusfailed(params: UpdateorderkotSuccess) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_FAILURE,
    payload: {
      previousStatus: params.previousStatus,
      index: params.miscData.index,
    },
  };
}

export function upadteKOTitemstatus(params: KOTItemupdatetypes) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_KOTITEM_STATUS,
    payload: params,
  };
}

export function resetState() {
  return {
    type: MASTER_DISPATCH_EVENTS.RESET_STATE,
  };
}

export function toggleshowBumporders() {
  return {
    type: MASTER_DISPATCH_EVENTS.TOGGLE_SHOW_BUMPORDERS,
  };
}

export function kotitemstatusUpdated(
  index: number,
  itemIndex: number,
  orderstatus: string
) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_KOTITEM_STATUS_SUCCESS,
    payload: { index, itemIndex, orderstatus },
  };
}

export function kotstatusUpdated(index: number, status: number) {
  return {
    type: MASTER_DISPATCH_EVENTS.UPDATE_KOT_STATUS_SUCCESS,
    payload: { index, status },
  };
}

export function verificationFailed(reason: string) {
  return {
    type: MASTER_DISPATCH_EVENTS.USER_NOT_VERIFIED,
    payload: { reason },
  };
}

export function tokenExpired(reason: string) {
  return {
    type: MASTER_DISPATCH_EVENTS.TOKEN_EXPIRED,
    payload: { reason },
  };
}
