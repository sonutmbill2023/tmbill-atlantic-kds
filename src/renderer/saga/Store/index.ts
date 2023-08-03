/* eslint-disable no-console */
import { takeEvery, put } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import apiCall from '../../services/api';
import {
  userVerified,
  verificationFailed,
  tokenExpired,
  setRunningtable,
  kotstatusUpdated,
  kotitemstatusUpdated,
  orderKOTstatusupdated,
  updatedorderKOTstatusfailed,
} from '../../redux/actions/Master';
import { Links, setPOSsettings } from '../../config/common';
import {
  KOTItemupdatetypes,
  Getsettledkotparams,
  ReduxState,
  MiscDatatype,
  UpdateorderkotSuccess,
} from '../../types';
import { MASTER_DISPATCH_EVENTS } from '../../constants/constants';
import { keyBy } from 'lodash';

type Verifyuserparams = {
  type: string;
  payload: {
    params: {
      username: string;
      password: string;
      miscData: MiscDatatype;
      ipaddress: string | undefined;
    };
  };
  params: any;
};

type UpdateOrderkotparam = {
  status: number;
  order_id: string;
  previousStatus: number;
  miscData: {
    index: number;
  };
};

const verifyuserAsync = createAsyncAction(
  MASTER_DISPATCH_EVENTS.VERIFY_USER,
  MASTER_DISPATCH_EVENTS.USER_VERIFIED,
  MASTER_DISPATCH_EVENTS.USER_NOT_VERIFIED,
)<Verifyuserparams, ReduxState, Error>();

const UpdateorderkotAsync = createAsyncAction(
  MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_STATUS,
  MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_SUCCESS,
  MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_FAILURE,
)<UpdateOrderkotparam, UpdateorderkotSuccess, Error>();

function* updateOrderkotstatus({
  payload,
}: ReturnType<typeof UpdateorderkotAsync.request>): Generator {
  try {
    const response: any = yield apiCall({
      url: Links.API_UPDATE_ORDERKOTSTATUS,
      method: 'PATCH',
      data: payload,
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
    // console.log(response);
    if (response !== undefined && response.data) {
      const { data } = response;
      if (data.status === 200) {
        yield put(orderKOTstatusupdated(payload));
      } else if (data.message) {
        yield put(updatedorderKOTstatusfailed(payload));
      }
    } else {
      yield put(updatedorderKOTstatusfailed(payload));
    }
    // eslint-disable-next-line no-empty
  } catch (error: any) {
    console.log({ error });
    if (error && error?.response) {
      const { status } = error?.response;
      if (status === 401) {
        yield put(tokenExpired('Token Expired.'));
      }
    }
  }
}

function* verifyUser(
  action: ReturnType<typeof verifyuserAsync.request>,
): Generator {
  try {
    const response: any = yield apiCall({
      url: Links.API_LOGIN,
      method: 'POST',
      data: {
        username: action.payload.params.username,
        password: action.payload.params.password,
      },
    });
    if (response !== undefined && response.data) {
      const { data } = response;
      if (data.status === 200) {
        const { storeDetails } = data;
        const settings = keyBy(data.settings, 'id');

        setPOSsettings(settings);

        delete data.settings;
        delete data.storeDetails;

        if (data.data && data.data.is_kds_app) {
          Links.TOKEN = data.token;
          yield put(
            userVerified({
              data,
              storeDetails,
              miscData: action.payload.params.miscData,
              settings,
            }),
          );
        } else {
          yield put(
            verificationFailed(`Looks like you don't have access to KDS`),
          );
        }
      } else if (data.message) {
        yield put(verificationFailed(data.message));
      }
    } else {
      yield put(verificationFailed('Something went wrong'));
    }
    // eslint-disable-next-line no-empty
  } catch (error) {
    yield put(verificationFailed('Something went wrong'));
  }
}

type Params2 = {
  payload: {
    store_id: string;
    status?: string;
    miscParams?: Getsettledkotparams;
  };
};

function* getRunningtable({ payload }: Params2) {
  try {
    const { data, status } = yield apiCall({
      url: Links.API_RUNNINGTABLES,
      method: 'GET',
      params: {
        store_id: payload.store_id,
        status: payload.status || undefined,
        showQsrorders:
          payload?.miscParams?.showQsrorders === 1 ? 'show' : undefined,
        showOnlineorders:
          payload?.miscParams?.showOnlineorders === 1 ? 'show' : undefined,
        showDigitalorders:
          payload?.miscParams?.showOnlineorders === 1 ? 'show' : undefined,
        assignedKitchedeps: payload?.miscParams?.assignedKitchedeps,
        showAllorders: payload?.miscParams?.showAllorders,
      },
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
    if (data && status === 200 && data.status === 200) {
      yield put(setRunningtable(data.data.tables, data.data.settledOrders));
    }
  } catch (error: any) {
    console.log({ error });
    if (error && error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(tokenExpired('Token Expired.'));
      }
    }
  }
}

type Params3 = {
  payload: {
    kot_id: number;
    status: number;
    miscData: {
      index: number;
    };
  };
};

type ISettleAll = {
  payload: {
    kot_id: number[];
    order_id: string[];
    status: number;
    order_status: number;
    miscData: {
      index: number;
    };
  };
};

type Params4 = {
  payload: KOTItemupdatetypes;
  type: string;
};
function* updateKOTitemstatus({ payload }: Params4) {
  try {
    const { data, status } = yield apiCall({
      url: Links.API_UPDATE_KOTITEMSTATUS,
      method: 'PATCH',
      data: {
        kot_item_id: payload.kot_item_id,
        orderstatus: payload.orderstatus,
      },
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
    // console.log(data);
    if (data && status === 200 && data.status === 200) {
      yield put(
        kotitemstatusUpdated(
          payload.miscData?.parentIndex,
          payload.miscData?.itemIndex,
          payload.orderstatus,
        ),
      );
    }
  } catch (error: any) {
    console.log({ error });
    if (error && error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(tokenExpired('Token Expired.'));
      }
    }
  }
}

function* updateKOTstatus({ payload }: Params3) {
  try {
    const { data, status } = yield apiCall({
      url: Links.API_UPDATE_KOTSTATUS,
      method: 'PATCH',
      data: {
        kot_id: payload.kot_id,
        status: payload.status,
      },
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
    // console.log(data);
    if (data && status === 200 && data.status === 200) {
      yield put(kotstatusUpdated(payload.miscData.index, payload.status));
    }
  } catch (error: any) {
    if (error && error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(tokenExpired('Token Expired.'));
      }
    }
  }
}

function* sendsettleAll({ payload }: ISettleAll) {
  try {
    const { data, status } = yield apiCall({
      url: Links.API_SETTLE_ALL,
      method: 'PATCH',
      data: {
        kot_id: payload.kot_id,
        order_id: payload.order_id,
        status: payload.status,
        order_status: payload.order_status,
      },
      headers: {
        Authorization: `Bearer ${Links.TOKEN}`,
      },
    });
    // console.log(data);
    if (data && status === 200 && data.status === 200) {
      yield put(kotstatusUpdated(payload.miscData.index, payload.status));
    }
  } catch (error: any) {
    console.log({ error });
    if (error && error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(tokenExpired('Token Expired.'));
      }
    }
  }
}

export default function* root() {
  yield takeEvery(verifyuserAsync.request, verifyUser);
  yield takeEvery(UpdateorderkotAsync.request, updateOrderkotstatus);
  yield takeEvery(MASTER_DISPATCH_EVENTS.GET_RUNNING_TABLES, getRunningtable);
  yield takeEvery(MASTER_DISPATCH_EVENTS.UPDATE_KOT_STATUS, updateKOTstatus);
  yield takeEvery(MASTER_DISPATCH_EVENTS.SETTLE_ALL_STATUS, sendsettleAll);

  yield takeEvery(
    MASTER_DISPATCH_EVENTS.UPDATE_KOTITEM_STATUS,
    updateKOTitemstatus,
  );
}
