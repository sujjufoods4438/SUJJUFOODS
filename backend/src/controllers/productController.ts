import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';

export const DEFAULT_PRODUCT = {
  sku: 'SF-TEA-250G',
  name: 'SUJJU FOODS Tea Powder',
  packSize: '250 grams',
  unitWeightGrams: 250,
  unitPrice: 180, // STRICT BUSINESS RULE: ₹180 per 250g piece
  description: 'Premium rich aromatic CTC and orthodox blend sourced directly from high-elevation plantations. Delivers authentic golden-amber colour, strong liquor and unmatched refreshing taste.',
  images: [
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80',
  ],
  inStock: true,
  gstPercentage: 0, // NO GST under current approved project configuration
  hsnCode: '09024020',
  isActive: true,
};

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await ProductModel.find({ isActive: true });
    if (products && products.length > 0) {
      res.json({ success: true, data: products });
      return;
    }
    // Return standard initial product if DB is fresh
    res.json({ success: true, data: [DEFAULT_PRODUCT] });
  } catch (error: any) {
    res.json({ success: true, data: [DEFAULT_PRODUCT] });
  }
}

export async function getProductBySku(req: Request, res: Response): Promise<void> {
  const { sku } = req.params;
  try {
    const product = await ProductModel.findOne({ sku, isActive: true });
    if (product) {
      res.json({ success: true, data: product });
      return;
    }
    if (sku === DEFAULT_PRODUCT.sku) {
      res.json({ success: true, data: DEFAULT_PRODUCT });
      return;
    }
    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error: any) {
    res.json({ success: true, data: DEFAULT_PRODUCT });
  }
}
