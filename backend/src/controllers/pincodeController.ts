import { Request, Response } from 'express';

// Andhra Pradesh & Major Indian Serviceable Pincodes directory for Sujju Foods
const SERVICEABLE_PINCODES: Record<string, { city: string; district: string; state: string; country: string }> = {
  // Andhra Pradesh (Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada, Nellore, Kurnool)
  '530001': { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
  '530002': { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
  '530016': { city: 'Dwaraka Nagar', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
  '530020': { city: 'Siripuram', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
  '520001': { city: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh', country: 'India' },
  '520002': { city: 'Governorpet', district: 'NTR', state: 'Andhra Pradesh', country: 'India' },
  '520010': { city: 'Benz Circle', district: 'NTR', state: 'Andhra Pradesh', country: 'India' },
  '522001': { city: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', country: 'India' },
  '522002': { city: 'Arundelpet', district: 'Guntur', state: 'Andhra Pradesh', country: 'India' },
  '517501': { city: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh', country: 'India' },
  '533101': { city: 'Rajahmundry', district: 'East Godavari', state: 'Andhra Pradesh', country: 'India' },
  '533001': { city: 'Kakinada', district: 'Kakinada', state: 'Andhra Pradesh', country: 'India' },
  '524001': { city: 'Nellore', district: 'SPSR Nellore', state: 'Andhra Pradesh', country: 'India' },
  '518001': { city: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', country: 'India' },
  '500001': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', country: 'India' },
  '500081': { city: 'Madhapur', district: 'Hyderabad', state: 'Telangana', country: 'India' },
};

export async function lookupPincode(req: Request, res: Response): Promise<void> {
  const { pincode } = req.params;

  if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
    res.status(400).json({ success: false, message: 'Invalid 6-digit Indian PIN code format' });
    return;
  }

  const match = SERVICEABLE_PINCODES[pincode];

  if (match) {
    res.json({
      success: true,
      pincode,
      ...match,
      isServiceable: true,
      deliveryPromise: '24-Hour Guaranteed Delivery (Subject to confirmed stock & active distributor)',
    });
    return;
  }

  // Fallback for valid Indian pincode outside standard coverage
  const regionCode = pincode.substring(0, 2);
  let state = 'Andhra Pradesh / Telangana';
  if (['11', '12', '13'].includes(regionCode)) state = 'North India';
  if (['56', '57', '58'].includes(regionCode)) state = 'Karnataka';
  if (['60', '61', '62', '63', '64'].includes(regionCode)) state = 'Tamil Nadu';

  res.json({
    success: true,
    pincode,
    city: 'Regional Hub',
    district: 'Postal Area',
    state,
    country: 'India',
    isServiceable: false,
    deliveryPromise: 'Area currently under network expansion. Standard 3-5 days delivery applies.',
  });
}
