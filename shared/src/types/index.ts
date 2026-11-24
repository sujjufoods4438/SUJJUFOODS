export type UserRole =
  | 'super_admin'
  | 'operations_admin'
  | 'finance_admin'
  | 'content_manager'
  | 'customer'
  | 'distributor'
  | 'employee';

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Distributor Assigned'
  | 'Accepted by Distributor'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Attempted'
  | 'Returned'
  | 'Cancelled';

export type PaymentMode = 'cash' | 'upi';
export type CollectionStatus = 'pending' | 'collected' | 'reconciled' | 'disputed';

export interface LocationDetails {
  pincode: string;
  postOffice?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  isServiceable: boolean;
}

export interface AddressInfo {
  houseNumber: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  recipientName: string;
  contactNumber: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderPricing {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number; // 0 under current configuration
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
}
