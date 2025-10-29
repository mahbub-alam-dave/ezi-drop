// pages/api/payment/sslcommerz-save.js
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req, res) {
  try {
    const body = await req.body; // SSLCommerz response
    const {
      value_a: parcelId,
      cus_name: name,
      cus_email: email,
      cus_phone: phone,
      currency,
      amount,
      status, // VALID / FAILED / CANCELLED
    } = body;

    // Map SSLCommerz status to friendly status
    let paymentStatus = "pending";
    if (status === "VALID") paymentStatus = "success";
    else if (status === "FAILED") paymentStatus = "failed";
    else paymentStatus = "cancel";

    await dbConnect("parcelPayment").insertOne({
      parcelId,
      name,
      email,
      phone,
      amount: Number(amount),
      currency,
      payment_gateway: "sslcommerz",
      status: paymentStatus,
      payment_time: new Date(),
    });

    res.status(200).json({ message: "SSLCommerz payment attempt saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
