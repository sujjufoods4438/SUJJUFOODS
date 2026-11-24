import PDFDocument from 'pdfkit';
import { IOrder } from '../models/Order.js';

export function generateInvoicePdf(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#174A36'; // Deep tea green
      const goldColor = '#C69A48'; // Warm gold
      const darkColor = '#1C2520';
      const grayColor = '#555555';
      const lightBg = '#F4EEDC';

      // --- HEADER ---
      doc.rect(40, 40, 515, 60).fill(primaryColor);

      doc
        .fillColor('#FFFFFF')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('SUJJU FOODS', 55, 52);

      doc
        .fontSize(9)
        .font('Helvetica')
        .text('Purest Farm-Fresh Premium Tea Powder', 55, 78);

      doc
        .fillColor(goldColor)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('TAX INVOICE', 400, 52, { align: 'right', width: 140 });

      doc
        .fillColor('#FFFFFF')
        .fontSize(8)
        .font('Helvetica')
        .text('ORIGINAL FOR RECIPIENT', 400, 72, { align: 'right', width: 140 });

      // --- COMPANY DETAILS & INVOICE METADATA ---
      doc.moveDown(3);
      const topY = 115;

      // Seller Details
      doc
        .fillColor(primaryColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SOLD BY:', 40, topY);

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('SUJJU FOODS PRIVATE LIMITED', 40, topY + 14);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(grayColor)
        .text('Industrial Development Area, Phase II', 40, topY + 28)
        .text('Visakhapatnam, Andhra Pradesh, 530016', 40, topY + 39)
        .text('Phone: +91 98765 43210 | Email: support@sujjufoods.com', 40, topY + 50)
        .text('HSN Chapter: 0902 | Food Business Reg: AP-VZ-2024-88', 40, topY + 61);

      // Invoice Details Block
      const invNumber = order.invoiceNumber || `INV-${new Date().getFullYear()}-${order.orderId.replace(/[^0-9]/g, '').slice(-6) || '100001'}`;
      const invDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      doc
        .fillColor(primaryColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('INVOICE DETAILS:', 340, topY);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(darkColor)
        .text(`Invoice No: `, 340, topY + 14)
        .font('Helvetica-Bold')
        .text(invNumber, 410, topY + 14)
        .font('Helvetica')
        .text(`Invoice Date: `, 340, topY + 26)
        .text(invDate, 410, topY + 26)
        .text(`Order Reference: `, 340, topY + 38)
        .font('Helvetica-Bold')
        .text(order.orderId, 410, topY + 38)
        .font('Helvetica')
        .text(`Payment Mode: `, 340, topY + 50)
        .text(`${(order.paymentMode || 'Cash').toUpperCase()} on Delivery`, 410, topY + 50)
        .text(`Status: `, 340, topY + 62)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text((order.collectionStatus || 'Pending').toUpperCase(), 410, topY + 62);

      // --- BILL TO / SHIP TO ---
      const billY = 200;
      doc.rect(40, billY, 515, 65).fill('#FAF8F1').stroke('#E2ECE6');

      doc
        .fillColor(primaryColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('BILL TO & SHIP TO CUSTOMER:', 50, billY + 8);

      const addr = order.deliveryAddress || {};
      const customerName = order.customerName || addr.recipientName || 'Valued Customer';
      const addressLine = `${addr.houseNumber || ''} ${addr.street || ''}, ${addr.area || ''}`.trim() || 'Dwaraka Nagar';
      const cityLine = `${addr.city || 'Visakhapatnam'}, ${addr.district || 'Visakhapatnam'}, ${addr.state || 'Andhra Pradesh'} - ${addr.pincode || '530001'}`;

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(customerName, 50, billY + 22);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(grayColor)
        .text(addressLine, 50, billY + 34)
        .text(cityLine, 50, billY + 45)
        .text(`Contact: ${addr.contactNumber || order.customerPhone || '+91 98765 12345'} | Email: ${order.customerEmail || 'customer@example.com'}`, 50, billY + 56);

      // --- LINE ITEMS TABLE ---
      const tableY = 280;
      // Header Bar
      doc.rect(40, tableY, 515, 22).fill(primaryColor);

      doc
        .fillColor('#FFFFFF')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('S.No', 45, tableY + 7)
        .text('Item Description & Specification', 75, tableY + 7)
        .text('HSN Code', 260, tableY + 7)
        .text('Pack Size', 320, tableY + 7)
        .text('Qty', 380, tableY + 7)
        .text('Rate (₹)', 425, tableY + 7)
        .text('Amount (₹)', 480, tableY + 7, { align: 'right', width: 65 });

      // Row 1 (Standard Product)
      const rowY = tableY + 22;
      doc.rect(40, rowY, 515, 30).fill('#FFFFFF').stroke('#E5E7EB');

      const qty = order.quantity || 1;
      const rate = order.unitPrice || 180;
      const subtotal = order.subtotal || qty * rate;

      doc
        .fillColor(darkColor)
        .fontSize(8)
        .font('Helvetica')
        .text('1', 45, rowY + 10)
        .font('Helvetica-Bold')
        .text('SUJJU FOODS Tea Powder', 75, rowY + 6)
        .font('Helvetica')
        .fontSize(7)
        .fillColor(grayColor)
        .text('100% CTC Orthodox Granulated Plantation Blend', 75, rowY + 17)
        .fontSize(8)
        .fillColor(darkColor)
        .text('09024020', 260, rowY + 10)
        .text(order.packSize || '250 grams', 320, rowY + 10)
        .font('Helvetica-Bold')
        .text(qty.toString(), 380, rowY + 10)
        .font('Helvetica')
        .text(rate.toFixed(2), 425, rowY + 10)
        .font('Helvetica-Bold')
        .text(subtotal.toFixed(2), 480, rowY + 10, { align: 'right', width: 65 });

      // --- TOTALS & TAX BREAKDOWN ---
      const summaryY = rowY + 38;

      // Note on 0% GST configuration
      doc.rect(40, summaryY, 280, 85).fill('#FAF8F1').stroke('#E2ECE6');
      doc
        .fillColor(primaryColor)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('Statutory & Tax Disclosures:', 50, summaryY + 8);

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(grayColor)
        .text('• Approved Tax Configuration: 0% GST applied on this product.', 50, summaryY + 22)
        .text('• Delivery SLA: 24-Hour delivery target from confirmation.', 50, summaryY + 34)
        .text('• Delivery Mode: Assigned territory distributor doorstep handover.', 50, summaryY + 46)
        .text('• Payment: Handed over in Cash or via UPI to authorized distributor.', 50, summaryY + 58)
        .text('• Batch-verified and nitrogen vacuum-sealed for fresh aroma.', 50, summaryY + 70);

      // Calculations block
      const calcX = 330;
      doc.rect(calcX, summaryY, 225, 85).fill('#FFFFFF').stroke('#E5E7EB');

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(darkColor)
        .text('Subtotal:', calcX + 10, summaryY + 8)
        .text(`₹${subtotal.toFixed(2)}`, calcX + 130, summaryY + 8, { align: 'right', width: 80 })

        .text('CGST (0%):', calcX + 10, summaryY + 22)
        .text('₹0.00', calcX + 130, summaryY + 22, { align: 'right', width: 80 })

        .text('SGST (0%):', calcX + 10, summaryY + 34)
        .text('₹0.00', calcX + 130, summaryY + 34, { align: 'right', width: 80 })

        .text('Delivery Charge:', calcX + 10, summaryY + 46)
        .fillColor('#2E7D32')
        .font('Helvetica-Bold')
        .text('FREE (₹0.00)', calcX + 130, summaryY + 46, { align: 'right', width: 80 });

      // Grand Total Highlight
      doc.rect(calcX, summaryY + 60, 225, 25).fill(primaryColor);
      doc
        .fillColor('#FFFFFF')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('TOTAL AMOUNT:', calcX + 10, summaryY + 67)
        .text(`₹${(order.totalAmount || subtotal).toFixed(2)}`, calcX + 120, summaryY + 67, {
          align: 'right',
          width: 95,
        });

      // --- SIGNATURE & FOOTER ---
      const footerY = 460;
      doc.rect(40, footerY, 515, 60).fill('#FAFAFA').stroke('#E5E7EB');

      doc
        .fillColor(grayColor)
        .fontSize(7.5)
        .font('Helvetica')
        .text('Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.', 50, footerY + 8, { width: 320 })
        .text('This is a computer-generated tax invoice generated by SUJJU FOODS Enterprise Platform.', 50, footerY + 32);

      doc
        .fillColor(primaryColor)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('For SUJJU FOODS PRIVATE LIMITED', 380, footerY + 8, { align: 'center', width: 165 })
        .fontSize(7)
        .font('Helvetica')
        .fillColor(grayColor)
        .text('Authorized Signatory', 380, footerY + 44, { align: 'center', width: 165 });

      // Bottom Gold Strip
      doc.rect(40, 530, 515, 4).fill(goldColor);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
