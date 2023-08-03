const MASTER_DISPATCH_EVENTS = {
  TOGGLE_SHOW_BUMPORDERS: 'TOGGLE_SHOW_BUMPORDERS',
  RESET_STATE: 'RESET_STATE',
  VERIFY_USER: 'VERIFY_USER',
  USER_VERIFIED: 'USER_VERIFIED',
  USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
  GET_RUNNING_TABLES: 'GET_RUNNING_TABLES',
  SET_RUNNING_TABLES: 'SET_RUNNING_TABLES',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UPDATE_KOT_STATUS: 'UPDATE_KOT_STATUS',
  UPDATE_KOTITEM_STATUS: 'UPDATE_KOTITEM_STATUS',
  UPDATE_KOT_STATUS_SUCCESS: 'UPDATE_KOT_STATUS_SUCCESS',
  UPDATE_KOTITEM_STATUS_SUCCESS: 'UPDATE_KOTITEM_STATUS_SUCCESS',
  UPDATE_ORDERKOT_STATUS: 'UPDATE_ORDERKOT_STATUS',
  UPDATE_ORDERKOT_SUCCESS: 'UPDATE_ORDERKOT_SUCCESS',
  UPDATE_ORDERKOT_FAILURE: 'UPDATE_ORDERKOT_FAILURE',
  SETTLE_ALL_STATUS: 'SETTLE_ALL_STATUS',
};

export const KOTITEM_STATUS = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  REJECTED: 'Rejected',
};
export const KOT_ITEM_STATUS = {
  PLACED: 1,
  DELETED: 2,
  CANCELLED: 3,
  EDITED: 4,
};
export const KOT_STATES = ['placed', 'bumped', 'preparing', 'ready', 'served'];

export const KOT_STATES_BYFLAG = {
  PLACED: 1,
  BUMPED: 2,
  PREPARING: 3,
  READY: 4,
  SERVED: 5,
};

export const BILL_STATES_BYFLAG = {
  SERVED: 1,
  PLACED: 2,
  BUMPED: 3,
  PREPARING: 4,
  READY: 5,
};

export const KOT_STATES_FOR_SETTLED = [
  'served',
  'placed',
  'bumped',
  'preparing',
  'ready',
];
export const STATUS_WITHOUT_BUMP = '1,3,4';
export const STATUS_FOR_BUMP = '2';
export const STATUS_FOR_SERVED = '5';

export const ORDER_EVENTS = {
  BILL_SAVED: 'bill-saved',
  BILL_SETTLED: 'bill-settled',
  BILL_PRINTED: 'bill-printed',
  KOT_SAVED: 'kot-saved',
  KOT_UPDATED: 'kot-updated',
  MESSAGE: 'message',
};
export const KDS_EVENTS = {
  ITEM_STATUS_CHANGED: 'item-status-changed',
  KOT_UPDATED: 'kds-kot-updated',
  KOT_STATUS_UPDATES: 'kds-kot-status-updated',
};

export const GLOBAL_EVENTS = {
  CLOSING_APP: 'exit-app',
};
export const PRINT_EVENTS = {
  KOT: 'print-kot-request',
  BILL: 'print-bill-request',
  KOT_PRINTED: 'print-kotrequest-complete',
};

export const BILLTYPES = [
  'Quick Bill', //0
  'Dine-In', //1
  'Takeaway', //2
  'Delivery', //3
  'Zomato', //4(4,5,6,)
  'Swiggy', //5
  'Uber Eats', //6
  'Dunzo', //7,
  'Digital Order', //8,
  'dineout', //9
  'Google Pay', //10
  'gupshup', //11
  'peppo', //12
  'amazon food', //13
  'dotpe', //14
  'eazydiner', //15
  'dukaan', //16
  'jungleworks', //17
  'YUMZY', //18
  'magicpin', //19
  'THRIVE', //20
  'talabat', //21
  'RADYES', //22
  'MYMENU', //23
  'deliverect', //24
  'FoodPanda', //25
  'HungerStation', //26,
  'Jahez',
  'ToYou',
  'Chefz',
  'Marsool',
  'Wassel',
  'Walem',
  'Careem', //33
  'TMT', //34,
  'Mathaqi', //35
  'Ezhalha', //36
  'Lugmety', //37
  'FoodBoy', //38
  'Yummy', //39
  'Upsale', //40
  'Wizzy', //41
  'Snoonu', //42
  'Rafeeq', //43
  'Mr D', //44
  'Accounts', //45,
  '',
  'Gatoes', //47
  'Wal Aan', //48
  '',
  'Mychharo', //49
];
// eslint-disable-next-line import/prefer-default-export
export { MASTER_DISPATCH_EVENTS };
