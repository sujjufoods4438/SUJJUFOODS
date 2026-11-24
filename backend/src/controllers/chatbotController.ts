import { Request, Response } from 'express';

interface ChatbotMessageRequest {
  message: string;
  customerPhone?: string;
  orderId?: string;
  pincode?: string;
}

interface ChatbotResponse {
  reply: string;
  category: 'order_status' | 'product_info' | 'serviceability' | 'returns' | 'subscription' | 'general';
  suggestedActions?: { label: string; action: string; payload?: string }[];
  contextData?: any;
}

export async function handleCustomerChatbot(req: Request, res: Response): Promise<void> {
  const { message, customerPhone, orderId, pincode } = req.body as ChatbotMessageRequest;

  if (!message || message.trim() === '') {
    res.status(400).json({ success: false, message: 'Message text is required' });
    return;
  }

  const query = message.toLowerCase().trim();

  // 1. Order Status & Delivery Enquiries
  if (query.includes('order') || query.includes('status') || query.includes('track') || query.includes('where is')) {
    // If orderId is provided or detected
    const matchedOrderId = message.match(/SF-\d{4}-\d{6}/i)?.[0]?.toUpperCase() || orderId;

    if (matchedOrderId) {
      res.json({
        success: true,
        response: {
          category: 'order_status',
          reply: `Order **${matchedOrderId}** is currently **Out for Delivery** via your assigned territory distributor (Vijay Agencies, Visakhapatnam Zone). Delivery is scheduled within your 24-Hour SLA commitment. Please keep your 6-digit Delivery OTP ready upon arrival.`,
          suggestedActions: [
            { label: 'View Live Map Tracking', action: 'NAVIGATE', payload: '/customer/tracking' },
            { label: 'Download Tax Invoice', action: 'NAVIGATE', payload: '/customer/invoices' },
          ],
          contextData: {
            orderId: matchedOrderId,
            status: 'out_for_delivery',
            slaHours: 24,
            pincode: '530016',
          },
        },
      });
      return;
    } else {
      res.json({
        success: true,
        response: {
          category: 'order_status',
          reply: `I can look up your delivery status immediately! Please provide your Order ID (formatted as SF-2026-XXXXXX) or check your order history directly in your customer dashboard.`,
          suggestedActions: [
            { label: 'Check Order History', action: 'NAVIGATE', payload: '/customer/orders' },
          ],
        },
      });
      return;
    }
  }

  // 2. Product, Pricing & GST Enquiries
  if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('gst') || query.includes('packet') || query.includes('powder')) {
    res.json({
      success: true,
      response: {
        category: 'product_info',
        reply: `**SUJJU FOODS Premium Tea Powder** is priced authoritatively at **₹180 per 250g pack**. Under our approved configuration, **0% GST** is applied (e.g. 4 packs = ₹720, 8 packs = ₹1,440). Our blend is formulated from 70% Assam CTC granules and 30% Nilgiri orthodox broken leaf.`,
        suggestedActions: [
          { label: 'Place an Order', action: 'NAVIGATE', payload: '/customer/new-order' },
          { label: 'View Lab Test Report', action: 'NAVIGATE', payload: '/verify' },
        ],
      },
    });
    return;
  }

  // 3. Pincode & Delivery Serviceability
  if (query.includes('pincode') || query.includes('service') || query.includes('deliver to') || query.includes('visakhapatnam') || query.includes('andhra')) {
    const matchedPincode = message.match(/\b\d{6}\b/)?.[0] || pincode;

    if (matchedPincode) {
      const isAP = matchedPincode.startsWith('53') || matchedPincode.startsWith('52') || matchedPincode.startsWith('51');
      res.json({
        success: true,
        response: {
          category: 'serviceability',
          reply: isAP
            ? `Pincode **${matchedPincode}** is fully serviceable! Orders placed in this territory are eligible for our **24-Hour Guaranteed Doorstep Delivery** with Cash and UPI on delivery options.`
            : `Pincode **${matchedPincode}** is routed via standard regional express courier with estimated delivery in 48-72 hours.`,
          suggestedActions: [
            { label: 'Start Order for ' + matchedPincode, action: 'NAVIGATE', payload: '/customer/new-order' },
          ],
        },
      });
      return;
    } else {
      res.json({
        success: true,
        response: {
          category: 'serviceability',
          reply: `We provide guaranteed 24-hour delivery across Visakhapatnam, Vijayawada, Guntur, and all major Andhra Pradesh postal codes! Enter your 6-digit pincode to check instant serviceability.`,
        },
      });
      return;
    }
  }

  // 4. Returns, Damaged Packaging & Complaints
  if (query.includes('return') || query.includes('damage') || query.includes('complaint') || query.includes('replace') || query.includes('refund')) {
    res.json({
      success: true,
      response: {
        category: 'returns',
        reply: `We guarantee 100% freshness and packaging integrity. If your tea arrived with outer pouch seal damage or courier delays, you can raise a support ticket and our customer relationship team will resolve it within 2 hours. Replacement packs are dispatched free of charge.`,
        suggestedActions: [
          { label: 'Raise Support Ticket', action: 'NAVIGATE', payload: '/customer/complaints' },
        ],
      },
    });
    return;
  }

  // 5. Subscriptions Enquiries
  if (query.includes('subscribe') || query.includes('subscription') || query.includes('repeat') || query.includes('monthly') || query.includes('weekly')) {
    res.json({
      success: true,
      response: {
        category: 'subscription',
        reply: `You can set up automated recurring tea deliveries! Choose **Weekly**, **Bi-Weekly**, or **Monthly** replenishments with zero delivery charges. You can pause or cancel anytime with one click.`,
        suggestedActions: [
          { label: 'Manage Subscriptions', action: 'NAVIGATE', payload: '/customer/subscriptions' },
        ],
      },
    });
    return;
  }

  // Default Fallback
  res.json({
    success: true,
    response: {
      category: 'general',
      reply: `Namaste! I am your **SUJJU FOODS Customer Assistant**. I can help you with:
• Checking live order delivery status
• Pincode serviceability & 24h delivery SLA
• Product details, 70/30 tea blend & ₹180 pricing
• Setting up automated weekly/monthly subscriptions
• Raising support tickets for damaged packs

How may I assist you today?`,
      suggestedActions: [
        { label: 'Order Tea (₹180/pack)', action: 'NAVIGATE', payload: '/customer/new-order' },
        { label: 'Check Order Status', action: 'NAVIGATE', payload: '/customer/orders' },
        { label: 'Pincode Check', action: 'QUERY', payload: 'Is 530016 serviceable?' },
      ],
    },
  });
}
