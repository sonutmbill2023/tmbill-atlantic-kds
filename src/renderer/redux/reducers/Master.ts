import update from 'immutability-helper';
import { MASTER_DISPATCH_EVENTS } from '../../constants/constants';
import { IMasterState } from '../../types/Store';

const initalState: IMasterState = {
  storeDetails: {},
  miscData: {},
  tokenExpired: false,
  userDetails: {},
  runningtablekotDetails: [],
  settledOrders: [],
  showbumpOrders: false,
  settings: {},
};

const masterReducer = (state = initalState, action: any) => {
  switch (action.type) {
    case MASTER_DISPATCH_EVENTS.TOGGLE_SHOW_BUMPORDERS:
      return {
        ...state,
        showbumpOrders: !state.showbumpOrders,
      };
    case MASTER_DISPATCH_EVENTS.RESET_STATE:
      return {
        storeDetails: {},
        miscData: {},
        tokenExpired: false,
        userDetails: {},
        runningtablekotDetails: [],
        settledOrders: [],
      };
    case MASTER_DISPATCH_EVENTS.USER_VERIFIED:
      return {
        ...state,
        userDetails: action.payload.userDetails,
        miscData: action.payload.miscData,
        storeDetails: action.payload.storeDetails,
        tokenExpired: false,
        settings: action.payload.settings,
      };
    case MASTER_DISPATCH_EVENTS.USER_NOT_VERIFIED:
      return {
        ...state,
        userDetails: { error: action.payload.reason },
        miscData: {},
        tokenExpired: false,
      };
    case MASTER_DISPATCH_EVENTS.SET_RUNNING_TABLES:
      return {
        ...state,
        runningtablekotDetails: action.payload.runningtablekotDetails,
        settledOrders: action.payload.settledOrders,
      };
    case MASTER_DISPATCH_EVENTS.TOKEN_EXPIRED:
      return {
        storeDetails: {},
        miscData: {},
        tokenExpired: true,
        userDetails: {},
        settings: {},
      };
    case MASTER_DISPATCH_EVENTS.UPDATE_KOT_STATUS_SUCCESS: {
      let shouldRemove = action.payload.status === 5; // Served
      if (state.showbumpOrders && action.payload.status !== 2) {
        shouldRemove = true;
      } else if (action.payload.status === 2) {
        shouldRemove = true;
      }
      if (shouldRemove) {
        // If served then remove it from list
        return update(state, {
          runningtablekotDetails: { $splice: [[action.payload.index, 1]] },
        });
      }
      return update(state, {
        runningtablekotDetails: {
          [action.payload.index]: {
            status: { $set: action.payload.status },
          },
        },
      });
    }
    case MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_SUCCESS: {
      let shouldRemove = action.payload.status === 1; // Served
      if (state.showbumpOrders && action.payload.status !== 3) {
        shouldRemove = true;
      } else if (action.payload.status === 3) {
        shouldRemove = true;
      }
      if (shouldRemove) {
        // If served then remove it from list
        return update(state, {
          settledOrders: { $splice: [[action.payload.index, 1]] },
        });
      }
      return update(state, {
        settledOrders: {
          [action.payload.index]: {
            order_flag: { $set: action.payload.status },
          },
        },
      });
    }
    case MASTER_DISPATCH_EVENTS.SETTLE_ALL_STATUS: {
      return {
        ...state,
        runningtablekotDetails: [],
        settledOrders: [],
      };
    }
    case MASTER_DISPATCH_EVENTS.UPDATE_ORDERKOT_FAILURE:
      return update(state, {
        settledOrders: {
          [action.payload.index]: {
            order_flag: { $set: action.payload.previousStatus },
          },
        },
      });
    case MASTER_DISPATCH_EVENTS.UPDATE_KOTITEM_STATUS_SUCCESS:
      return update(state, {
        runningtablekotDetails: {
          [action?.payload?.index]: {
            items: {
              [action?.payload?.itemIndex]: {
                orderstatus: { $set: action?.payload?.orderstatus },
              },
            },
          },
        },
      });
    default:
      return state;
    // break;
  }
};

export default masterReducer;
