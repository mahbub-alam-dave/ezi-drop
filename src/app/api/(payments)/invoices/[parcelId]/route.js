import { dbConnect } from "@/lib/dbConnect";
import { generateInvoicePDF } from "@/lib/invoice";

export async function GET(req, { params }) {
  try {
    const { parcelId } = params;
    const parcels = dbConnect("parcels");

    // 1️⃣ Find the parcel
    const parcel = await parcels.findOne({ parcelId });
    if (!parcel) {
      return new Response(JSON.stringify({ ok: false, message: "Parcel not found" }), {
        status: 404,
      });
    }

    // 2️⃣ Check payment
    if (parcel.payment !== "done") {
      return new Response(JSON.stringify({ ok: false, message: "Payment not completed" }), {
        status: 400,
      });
    }

    // 3️⃣ Generate invoice PDF in memory
    const invoiceBuffer = await generateInvoicePDF(parcel);

    // 4️⃣ Return the PDF as a downloadable file
    return new Response(invoiceBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${parcel.parcelId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return new Response(JSON.stringify({ ok: false, message: "Server error" }), { status: 500 });
  }
}
