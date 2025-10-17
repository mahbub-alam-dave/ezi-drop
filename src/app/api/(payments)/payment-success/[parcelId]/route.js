/* import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    const p = await params;
    const parcelId = p.parcelId

    // Ensure DB connection
    const parcelsCollection = dbConnect("parcels");

    // Fetch the parcel data
    const updatedData = await parcelsCollection.findOne({ parcelId });

    if (!updatedData) {
      return NextResponse.json({ success: false, message: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedData }, { status: 200 });
  } catch (err) {
    console.error("Payment success API error:", err);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
} */
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { generateInvoicePDF } from "@/lib/invoice";
import { sendEmail } from "@/lib/email";

export async function GET(req, { params }) {
  const { parcelId } = params;
  const parcels = dbConnect("parcels");

  // 1️⃣ Find the parcel
  const parcel = await parcels.findOne({ parcelId });
  if (!parcel) {
    return NextResponse.json({ ok: false, message: "Parcel not found" }, { status: 404 });
  }

  // 2️⃣ Ensure payment is complete
  if (parcel.payment !== "done") {
    return NextResponse.json({ ok: false, message: "Payment not completed" }, { status: 400 });
  }

  // 3️⃣ Generate invoice PDF (in memory only)
  const invoiceBuffer = await generateInvoicePDF(parcel);

  // 4️⃣ Email notification with attached PDF
  if (parcel.senderEmail) {
    await sendEmail({
      to: parcel.senderEmail,
      // to: "dakterkhujun@gmail.com",
      subject: "Your EZI Drop Booking Confirmation ✅",
      text: `Dear ${parcel.senderName || "Customer"},\n\nYour payment and booking for parcel ${parcel.parcelId} are confirmed.\n\nThank you for choosing EZI Drop!`,
      attachments: [
        {
          filename: `${parcel.parcelId}.pdf`,
          content: invoiceBuffer,
        },
      ],
    });
  }

  // 5️⃣ Respond success (no file created locally)
  return NextResponse.json({
    ok: true,
    message: "Payment success processed and invoice sent via email",
  });
}
