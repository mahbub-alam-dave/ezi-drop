import PDFDocument from "pdfkit";

export async function generateInvoicePDF(parcel) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  return new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(20).text("EZI Drop Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${parcel.parcelId}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Sender / Receiver
    doc.fontSize(14).text("Sender Information", { underline: true });
    doc.fontSize(12).text(`Name: ${parcel.sender.name}`);
    doc.text(`Email: ${parcel.sender.email || "N/A"}`);
    doc.text(`District: ${parcel.sender.districtName}`);
    doc.moveDown();

    doc.fontSize(14).text("Receiver Information", { underline: true });
    doc.fontSize(12).text(`Name: ${parcel.receiver.name}`);
    doc.text(`Email: ${parcel.receiver.email || "N/A"}`);
    doc.text(`District: ${parcel.receiver.districtName}`);
    doc.moveDown();

    // Parcel details
    doc.fontSize(14).text("Parcel Details", { underline: true });
    doc.fontSize(12).text(`Tracking Number: ${parcel.trackingNumber}`);
    doc.text(`Weight: ${parcel.weight} kg`);
    doc.text(`Delivery Type: ${parcel.deliveryType}`);
    doc.text(`Status: ${parcel.status}`);
    doc.moveDown();

    // Payment info
    doc.fontSize(14).text("Payment Information", { underline: true });
    doc.fontSize(12).text(`Amount Paid: ${parcel.amount || "N/A"} BDT`);
    doc.text(`Transaction ID: ${parcel.transactionId}`);
    doc.text(`Payment Date: ${parcel.paymentDate?.toLocaleString()}`);
    doc.moveDown();

    doc.text("Thank you for using EZI Drop!", { align: "center" });

    doc.end();
  });
}
