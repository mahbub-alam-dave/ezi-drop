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
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { parcelId } = params;
  const db = dbConnect("parcels");
  const parcels = db.collection("parcels");

  // 1️⃣ Find parcel
  const parcel = await parcels.findOne({ parcelId });
  if (!parcel) {
    return NextResponse.json({ ok: false, message: "Parcel not found" }, { status: 404 });
  }

  // 2️⃣ Ensure payment is complete
  if (parcel.payment !== "done") {
    return NextResponse.json({ ok: false, message: "Payment not completed" }, { status: 400 });
  }

  // 4️⃣ Generate invoice PDF
  const invoiceBuffer = await generateInvoicePDF(parcel);
  const invoiceDir = path.join(process.cwd(), "public", "invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const invoicePath = path.join(invoiceDir, `${parcel.parcelId}.pdf`);
  fs.writeFileSync(invoicePath, invoiceBuffer);

  const invoiceUrl = `/invoices/${parcel.parcelId}.pdf`;

  // 5️⃣ Email notification
  if (parcel.sender?.email) {
    await sendEmail(
      parcel.sender.email,
      "Your EZI Drop Booking Confirmation ✅",
      `Dear ${parcel.sender.name || "Customer"},\n\nYour payment and booking for parcel ${parcel.parcelId} are confirmed.\n\nYou can download your invoice here:\n${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${invoiceUrl}\n\nThank you for choosing EZI Drop!`
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Payment success processed",
    invoiceUrl,
  });
}

