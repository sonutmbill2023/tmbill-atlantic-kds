type IRunningTableinfo = {
  table_id: number;
  table_name: string;
  kot_id: number;
  order_type_flag: number;
  in_time: number;
  status: number;
  createdBy: string;
  note: string;
  amount: number;
  items: Array<ItemType>;
  persons?: '' | number;
  kot_number?: number;
};

type ISettledOrderDetails = {
  created_time: number;
  order_id: string;
  billing_type: number;
  order_flag: number;
  user_id: string;
  instructions: string;
  bill_number: string;
  tmpos_order_child: Array<OrderItemType>;
  extra_details?: {
    order_number?: string;
  };
};

type OrderItemType = {
  id: number;
  title: string;
  quantity: number;
  note?: string;
};

type StoreDetailstype = {
  store_id: string;
  store_name: string;
  store_phone: string;
  user_phone: string;
};

type UserDetailstype = {
  status: 200;
  message: string;
  token: string;
  error?: string;
  data: {
    is_captain_app: number;
    is_kds_app: number;
    is_self_order: number;
    is_old_kot_enabled: number;
    assignedKitchedeps?: string;
  };
};
type IMasterReducer = {
  runningtablekotDetails: IRunningTableinfo[];
  storeDetails: StoreDetailstype;
  userDetails: UserDetailstype;
  tokenExpired: boolean;
  settledOrders: ISettledOrderDetails[];
  showbumpOrders: boolean;
  miscData: MiscDatatype;
};

type MiscDatatype = {
  outlet: string;
  ipAddress: string;
  baseUrl: string;
};
type ReduxState = {
  masterReducer: IMasterReducer;
  miscData: MiscDatatype;
  tokenExpired: boolean;
  userDetails: UserDetailstype;
  runningtablekotDetails: Array<IRunningTableinfo>[];
};

type ItemType = {
  kot_item_id: number;
  title: string;
  amount: number;
  item_price: number;
  quantity: number;
  item_id: number;
  item_tax_per: number;
  item_tax_value: number;
  item_tax_method: number;
  item_is_devidable: number;
  orderstatus: string;
  previousstatus: string;
  comment: string;
  kot_id: number;
  reason: string;
  note: string;
  status: number;
};

type KOTItemupdatetypes = {
  kot_item_id: number;
  orderstatus: string;
  previousstatus?: string;
  comment?: string;
  status?: string;
  reason?: string;
  miscData: {
    parentIndex: number;
    itemIndex: number;
  };
};

type VerifyuserResponse = {
  status: number;
  message?: string;
  data: {
    storeDetails: StoreDetailstype;
  };
};

type Getsettledkotparams = {
  showQsrorders: number;
  showOnlineorders: number;
  showDigitalorders: number;
  assignedKitchedeps?: string | undefined;
  showAllorders?: boolean;
};

type UpdateorderkotSuccess = {
  status: number;
  order_id: string;
  previousStatus: number;
  miscData: {
    index: number;
  };
};

export {
  OrderItemType,
  IMasterReducer as MasterReducer,
  IRunningTableinfo as Tableinfo,
  StoreDetailstype,
  ReduxState,
  ItemType,
  KOTItemupdatetypes,
  VerifyuserResponse,
  MiscDatatype,
  Getsettledkotparams,
  ISettledOrderDetails as OrderType,
  UpdateorderkotSuccess,
};
