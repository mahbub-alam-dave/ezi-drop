import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateInvoicePDF(parcel) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height, width } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const gray = rgb(0.4, 0.4, 0.4);
  const blue = rgb(0.2, 0.4, 0.8);

  let y = height - 60;
  const lineHeight = 18;
  const leftMargin = 50;

  // Helper function
  const drawText = (text, x, y, size = 12, fontUsed = font, color = rgb(0, 0, 0)) =>
    page.drawText(String(text || ""), { x, y, size, font: fontUsed, color });

  // === Header ===
  drawText("EZI Drop", leftMargin, y, 26, boldFont, blue);
  drawText("Smart Courier & Delivery Service", leftMargin, y - 22, 12, font, gray);

  drawText("Invoice", width - 150, y, 22, boldFont, rgb(0, 0, 0));
  y -= 60;

  // === Invoice Info ===
  drawText(`Invoice ID: ${parcel.parcelId}`, leftMargin, y);
  drawText(`Tracking ID: ${parcel.trackingId}`, leftMargin, y - lineHeight);
  drawText(`Date: ${new Date(parcel.createdAt).toLocaleString()}`, leftMargin, y - lineHeight * 2);
  y -= lineHeight * 3;

  // === Sender Info ===
  drawText("Sender Information", leftMargin, y, 14, boldFont, blue);
  y -= lineHeight;

  drawText(`Name: ${parcel.senderName}`, leftMargin, y);
  drawText(`Phone: ${parcel.senderPhone}`, leftMargin, y - lineHeight);
  drawText(`Email: ${parcel.senderEmail}`, leftMargin, y - lineHeight * 2);
  drawText(`Address: ${parcel.pickupAddress}`, leftMargin, y - lineHeight * 3);
  drawText(`District: ${parcel.pickupDistrict}`, leftMargin, y - lineHeight * 4);
  drawText(`Upazila: ${parcel.pickupUpazila}`, leftMargin, y - lineHeight * 5);

  y -= lineHeight * 6;

  // === Receiver Info ===
  drawText("Receiver Information", leftMargin, y, 14, boldFont, blue);
  y -= lineHeight;

  drawText(`Name: ${parcel.receiverName}`, leftMargin, y);
  drawText(`Phone: ${parcel.receiverPhone}`, leftMargin, y - lineHeight);
  drawText(`Email: ${parcel.receiverEmail}`, leftMargin, y - lineHeight * 2);
  drawText(`Address: ${parcel.deliveryAddress}`, leftMargin, y - lineHeight * 3);
  drawText(`District: ${parcel.deliveryDistrict}`, leftMargin, y - lineHeight * 4);
  drawText(`Upazila: ${parcel.deliveryUpazila}`, leftMargin, y - lineHeight * 5);

  y -= lineHeight * 6;

  // === Parcel Details ===
  drawText("Parcel Details", leftMargin, y, 14, boldFont, blue);
  y -= lineHeight;

  drawText(`Type: ${parcel.parcelType}`, leftMargin, y);
  drawText(`Weight: ${parcel.weight} kg`, leftMargin, y - lineHeight);
  drawText(`Delivery Type: ${parcel.deliveryType}`, leftMargin, y - lineHeight * 2);
  drawText(`Status: ${parcel.status}`, leftMargin, y - lineHeight * 3);
  drawText(`Wirehouse Address: ${parcel.wirehouseAddress || "N/A"}`, leftMargin, y - lineHeight * 4);

  y -= lineHeight * 5;

  // === Payment Info ===
  drawText("Payment Information", leftMargin, y, 14, boldFont, blue);
  y -= lineHeight;

  drawText(`Amount: ${parcel.amount} ${parcel.currency?.toUpperCase() || "BDT"}`, leftMargin, y);
  drawText(`Payment Status: ${parcel.payment}`, leftMargin, y - lineHeight);
  drawText(`Transaction ID: ${parcel.transactionId}`, leftMargin, y - lineHeight * 2);
  drawText(`Payment Date: ${new Date(parcel.paymentDate).toLocaleString()}`, leftMargin, y - lineHeight * 3);

  y -= lineHeight * 4;

  // === Footer / Note ===
  drawText("Thank you for choosing EZI Drop!", leftMargin, y, 14, boldFont, blue);
  drawText("We appreciate your trust and look forward to serving you again.", leftMargin, y - lineHeight, 11, font, gray);
  drawText("www.ezidrop.com | support@ezidrop.com", leftMargin, y - lineHeight * 2, 11, font, gray);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
