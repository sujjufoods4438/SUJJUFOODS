import mongoose from 'mongoose';
import { ProductModel } from '../backend/src/models/Product.js';
import { config } from '../backend/src/config/env.js';

async function seedProducts() {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for product seeding...');

  const existing = await ProductModel.findOne({ sku: 'SF-TEA-250G' });
  if (existing) {
    console.log(`Product already exists: ${existing.name} (${existing.sku})`);
    process.exit(0);
  }

  const product = new ProductModel({
    sku: 'SF-TEA-250G',
    name: 'SUJJU FOODS Tea Powder',
    packSize: '250 grams',
    unitWeightGrams: 250,
    unitPrice: 180, // STRICT BUSINESS RULE: ₹180 per piece
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
  });

  await product.save();
  console.log('Product seeded successfully: SUJJU FOODS Tea Powder - 250g @ ₹180 (No GST)');
  process.exit(0);
}

seedProducts().catch(console.error);
