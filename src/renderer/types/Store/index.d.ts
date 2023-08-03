import { IKeyBasedSettings } from '../Settings';

export interface CurrentReduxState {
  masterReducer: IMasterState;
}

export interface IMasterState {
  storeDetails?: IStoreDetails;
  miscData?: IMiscData;
  tokenExpired?: boolean;
  userDetails?: IUserDetails;
  runningtablekotDetails: IRunningtablekotDetail[];
  settledOrders: ISettledOrder[];
  showbumpOrders?: boolean;
  settings?: IKeyBasedSettings;
}

export interface IMiscData {
  outlet?: string;
  ipAddress?: string;
  baseUrl?: string;
}

export interface IRunningtablekotDetail {
  table_id?: number;
  table_name?: string;
  kot_id?: number;
  kot_number?: number;
  order_type_flag?: number;
  in_time?: number;
  status?: number;
  createdBy?: string;
  note?: string;
  amount?: number;
  persons?: number;
  items?: Item[];
}

export interface Item {
  kot_item_id?: number;
  title?: string;
  amount?: number;
  item_price?: number;
  quantity?: number;
  item_id?: number;
  item_tax_per?: number;
  item_tax_value?: number;
  item_tax_method?: number;
  item_is_devidable?: number;
  orderstatus?: string;
  previousstatus?: null;
  comment?: null;
  kot_id?: number;
  reason?: null;
  note?: null;
  status?: number;
  discounted_price?: number;
  discount_type?: number;
  discount_rate?: number;
  pricebeforeDiscount?: number;
  modified_discount?: number;
}

export interface ISettledOrder {
  created_time: number;
  order_id: string;
  bill_number: number;
  billing_type: number;
  order_flag: number;
  user_id: string;
  instructions: string;
  extra_details: ExtraDetails;
  tmpos_order_child: TmposOrderChild[];
  mpos_kots: MposKot[];
  persons?: number;
}

export interface ExtraDetails {
  otp?: string;
  invoiceType?: string;
  platform_id?: string;
  exlusive_tax?: number;
  previous_order_id?: string;
  item_level_discount?: number;
  merchant_order_total?: number;
  total_merchant_taxes?: number;
  channel_restaurant_name?: string;
  tax?: Tax[];
  roundedAmount?: number;
  totalCharges?: number;
  order_number?: number;
}

export interface Tax {
  name?: string;
  tax_percent?: number;
  amount?: number;
  tax_inclusive?: boolean;
  taxDivided?: boolean;
}

export interface MposKot {
  instructions?: string;
}

export interface TmposOrderChild {
  id?: number;
  title?: string;
  quantity?: number;
  note?: null | string;
}

export interface IStoreDetails {
  id?: number;
  store_id?: string;
  store_name?: string;
  store_phone?: string;
  user_phone?: string;
  disable_ordering?: number;
  username?: string;
  person_name?: string;
  user_email?: string;
  user_city?: string;
  user_line_1?: string;
  user_line_2?: null;
  user_sub_locality?: string;
  user_designation?: string;
  user_shift_time?: null;
  country?: string;
  currency?: string;
  store_email?: string;
  website?: string;
  note?: null;
  footer_note?: string;
  upi_id?: string;
  field1?: string;
  field2?: null;
  field3?: null;
  field4?: null;
  currency_code?: string;
  show_upi?: string;
  settings?: string;
  password?: string;
  resetBillAfterDays?: number;
  warehouse_id?: string;
  reduce_inventory?: string;
  tmpos_id?: string;
  sync_hash?: string;
  token?: string;
  access_levels?: string;
  reset_bill_time?: null;
  reset_kot_indays?: number;
  reset_kot_time?: null;
  show_poweredby?: number;
  alternative_outlet_name?: string;
  bill_number_prefix?: string;
  show_phone_on_bill?: string;
  logo?: string;
  field5?: null;
  field6?: null;
  field7?: null;
  field8?: null;
  loyalty_enabled?: number;
  reward_otp_verification?: number;
  custom_qr_codes?: string;
  logout_after_close_pos_app?: number;
  activation_expires_at?: Date;
  currency_name?: string;
  sub_currency_name?: string;
  field9?: null;
  field10?: null;
  field11?: null;
  field12?: null;
  custom_quickbill_ordertypes?: null;
  enabled_passcode_protection?: number;
  live_tracking_enabled?: number;
  brand_name?: string;
  secondary_bill_prefix?: string;
  point_of_contact?: string;
  bar_bill_prefix?: null;
  is_bar_section_billing?: number;
  pdam_start_time?: number;
  pdam_end_time?: number;
  tenant_id?: null;
  extra_info?: string;
}

export interface IUserDetails {
  status?: number;
  message?: string;
  settings?: Setting[];
  token?: string;
  data?: Data;
  error?: any;
}

export interface Data {
  is_captain_app?: number;
  is_kds_app?: number;
  is_self_order?: number;
  is_old_kot_enabled?: number;
  is_terminal_app?: number;
  assignedKitchedeps?: null;
  terminal_access_levels?: string;
  pos_access_levels?: string;
  captain_access_levels?: string;
}

export interface Setting {
  id?: number;
  name?: string;
  value?: string;
  store_id?: null;
}
