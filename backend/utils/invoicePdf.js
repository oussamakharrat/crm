import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export function generateInvoicePdf(invoice, client) {
  const uploadsDir = path.resolve('uploads', 'invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const pdfPath = path.join(uploadsDir, `${invoice.invoice_number}.pdf`);
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(fs.createWriteStream(pdfPath));

  // Header
  doc
    .rect(40, 40, 520, 60)
    .fill('#f5f5f5')
    .fillColor('#222')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('INVOICE', 50, 60, { align: 'left' })
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#666')
    .text('Your Company Name', 400, 50, { align: 'right' })
    .text('123 Main St, City, Country', 400, 65, { align: 'right' })
    .text('info@yourcompany.com | +123456789', 400, 80, { align: 'right' })
    .moveDown(2);

  // Invoice Info Box
  doc
    .roundedRect(40, 120, 250, 80, 8)
    .stroke('#cccccc')
    .fontSize(11)
    .fillColor('#222')
    .text(`Invoice Number: ${invoice.invoice_number}`, 50, 130)
    .text(`Date: ${invoice.issue_date}`, 50, 150)
    .text(`Due Date: ${invoice.due_date}`, 50, 170);

  // Client Info Box
  doc
    .roundedRect(310, 120, 250, 80, 8)
    .stroke('#cccccc')
    .fontSize(11)
    .fillColor('#222')
    .text('Bill To:', 320, 130)
    .font('Helvetica-Bold')
    .text(`${client.name || ''}`, 320, 145)
    .font('Helvetica')
    .text(`${client.email || ''}`, 320, 160)
    .text(`${client.phone || ''}`, 320, 175)
    .text(`${client.address || ''}`, 320, 190);

  // Table Header
  const tableTop = 220;
  doc
    .moveTo(40, tableTop)
    .lineTo(560, tableTop)
    .stroke('#cccccc')
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#222')
    .text('Description', 50, tableTop + 10)
    .text('Amount', 250, tableTop + 10)
    .text('Tax', 350, tableTop + 10)
    .text('Total', 450, tableTop + 10);

  // Table Row
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor('#444')
    .text(`Deal #${invoice.deal_id || ''}`, 50, tableTop + 35)
    .text(`$${invoice.amount}`, 250, tableTop + 35)
    .text(`$${invoice.tax}`, 350, tableTop + 35)
    .text(`$${invoice.total}`, 450, tableTop + 35);

  // Table Bottom Line
  doc
    .moveTo(40, tableTop + 60)
    .lineTo(560, tableTop + 60)
    .stroke('#cccccc');

  // Footer
  doc
    .fontSize(12)
    .fillColor('#222')
    .font('Helvetica-Oblique')
    .text('Thank you for your business!', 0, 700, { align: 'center' });

  doc.end();

  return `/uploads/invoices/${invoice.invoice_number}.pdf`;
} 