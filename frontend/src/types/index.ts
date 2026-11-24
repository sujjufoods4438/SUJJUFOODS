export interface Product {
  sku: string;
  name: string;
  packSize: string;
  unitWeightGrams: number;
  unitPrice: number;
  description: string;
  images: string[];
  inStock: boolean;
  gstPercentage: number;
  hsnCode: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'content_manager' | 'customer' | 'distributor' | 'employee';
  referralCode: string;
  sponsorId?: string;
}
