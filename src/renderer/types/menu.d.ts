export interface IPOSMenuResponse {
  status?: number;
  message?: string;
  data?: IPOSMenudata;
}

export interface IPOSMenuUpdate {
  store_id?: string;
  categories?: Partial<IPOSCategory>[];
  items?: Partial<IPOSItem>[];
}

export interface IPOSMenudata {
  categories?: IPOSCategory[];
  items?: IPOSItem[];
  option_group?: IPOSOptionGroup[];
  options?: any[];
  discount?: IPOSDiscount[];
  customer?: IPOSCustomer[];
  table_dept?: IPOSTableDept[];
  tables?: IPOSTable[];
  payment_mode?: IPOSPaymentMode[];
  charges?: IPOSCharge[];
  delivery_boys?: any[];
  kitchen_dept?: IPOSKitchenDept[];
  expense_categories?: IPOSExpenseCategory[];
  waiters?: any[];
  multipricing_settings?: IPOSMultipricingSetting[];
  itemmapeedCategories?: {
    [key: number]: IPOSCategory & {
      items: IPOSItem[];
    };
  };
}

export interface IPOSCategory {
  id?: number;
  category_refid?: number;
  category_name?: string;
  description?: Description | null;
  is_active?: number;
  img_url?: null;
  parent_ref_id?: number;
  store_id?: string;
}

export enum Description {
  Appetizers = 'Appetizers',
  SouthIndian = 'South Indian',
  VegBiryani = 'Veg Biryani',
}

export interface IPOSCharge {
  charge_id?: number;
  title?: string;
  per_or_fixed?: number;
  is_default?: number;
  billing_flag?: number;
  amount?: number;
  store_id?: string;
  applicable_on_items?: string;
  calculate_tax_for_item_charges?: boolean;
  charge_applicable_on?: number;
  delivery_free_afteramount?: number;
  delivery_applicable_platform?: number;
  is_tax_applicable?: number;
  tax_amount?: number;
  is_tax_included?: number;
  tax_title?: null | string;
  tax_divided?: boolean;
  extra_details?: ExtraDetails;
}

export interface ExtraDetails {
  zomato?: Zomato[];
  applicable_on?: boolean | string;
  applicable_on_amount?: number | string;
}

export interface Zomato {
  slug?: string;
  title?: number;
}

export interface IPOSCustomer {
  id?: number;
  store_id?: string;
  is_guest_mode?: number;
  address_line1?: string;
  address_line2?: null | string;
  sub_locality?: null;
  email?: null | string;
  name?: string;
  phone?: string;
  city?: null;
  state?: null;
  business_name?: null | string;
  description?: null;
  fssai?: null | string;
  panno?: null;
  adhar?: null;
  gstno?: Gstno | null;
  dob?: Date | null;
  anniversary?: Date | null;
  createdDate?: Date | null;
  pincode?: null | string;
  sync_flag?: number;
}

export enum Gstno {
  Empty = '',
  The27Aabcu9603R1Zn = '27AABCU9603R1ZN',
  The27Aadck7940H006 = '27AADCK7940H006',
}

export interface IPOSDiscount {
  id?: number;
  discount_name?: string;
  discount_type?: string;
  rate?: number;
  active?: number;
  status_flag?: number;
  is_modifiable?: number;
  store_id?: string;
  product_groups?: null;
}

export interface IPOSExpenseCategory {
  category_id?: number;
  ref_id?: number;
  category_name?: string;
  store_id?: string;
}

export interface IPOSItem {
  item_id?: number;
  item_refid?: number;
  tmpos_menu_id?: string;
  title?: string;
  short_code?: string;
  active?: number;
  description?: null | string;
  current_stock?: number;
  recommended?: string;
  sale_price?: number;
  option_group_ref_id?: string;
  tax_per?: number;
  tax_value?: number;
  tax_method?: number;
  itemsub_total?: number;
  category_ref_ids?: string;
  created_at?: null;
  modified_at?: null;
  is_devidable?: number;
  img_url?: null | string;
  food_type?: number;
  tax_name?: TaxName;
  kitchen_dept?: number;
  product_group?: number;
  tax_discount_method?: number;
  store_id?: string;
  preparation_time?: string;
  discounted_price?: number;
  discount_type?: number;
  discount_rate?: number;
  modified_discount?: number;
  hsn_code?: null | string;
  is_open_item?: number;
  discounted_items?: null;
  sale_price_1?: number;
  sale_price_2?: number;
  sale_price_3?: number;
  sale_price_4?: number;
  sale_price_5?: number;
  mpos_category?: MposCategory;
  mpos_productgroup?: MposProductgroup;
}

export interface MposCategory {
  category_name?: Description;
}

export interface MposProductgroup {
  product_group_name?: ProductGroupName;
}

export enum ProductGroupName {
  Food = 'Food',
  KitchenGroup = 'Kitchen Group',
}

export enum TaxName {
  Gst = 'GST',
}

export interface IPOSKitchenDept {
  id?: number;
  store_id?: number;
  kitchen_dept_name?: string;
}

export interface IPOSMultipricingSetting {
  id?: number;
  store_id?: string;
  settings?: Settings;
}

export interface Settings {
  order_type_wise?: Wise[];
  table_department_wise?: Wise[];
}

export interface Wise {
  id?: number;
  price_field?: string;
}

export interface IPOSOptionGroup {
  ref_id?: number;
  title?: string;
  description?: string;
  min_selectable?: number;
  max_selectable?: number;
  active?: number;
  item_ref_ids?: string;
  is_addon?: number;
  store_id?: string;
}

export interface IPOSPaymentMode {
  id?: number;
  payment_mode_name?: string;
  payment_mode_image?: string;
  store_id?: string;
}

export interface IPOSTableDept {
  id?: number;
  department_name?: string;
  is_active?: number;
  store_id?: string;
  section?: number;
  product_groups?: null;
}

export interface IPOSTable {
  id?: number;
  table_name?: string;
  isactive?: number;
  max_person?: string;
  department?: number;
  table_color?: null | string;
  order_type_flag?: number;
  table_action_flag?: number;
  store_id?: string;
  order_state?: null | string;
  parent?: number;
  is_pre_order?: number;
  is_old_table?: number;
  mpos_department?: MposDepartment;
}

export interface MposDepartment {
  department_name?: string;
}
