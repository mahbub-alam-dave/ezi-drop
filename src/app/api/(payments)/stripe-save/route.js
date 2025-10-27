// pages/api/payment/stripe-save.js
import { dbConnect } from "@/lib/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    const { session_id } = await req.body;
    if (!session_id) return res.status(400).json({ error: "session_id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Determine status
    let paymentStatus = "pending";
    if (session.payment_status === "paid") paymentStatus = "success";
    else if (session.payment_status === "unpaid") paymentStatus = "failed";
    else paymentStatus = "cancel";

    await dbConnect("parcelPayment").insertOne({
      parcelId: session.metadata.parcelId,
      name: session.customer_details.name || "",
      email: session.customer_details.email,
      phone: session.customer_details.phone || "",
      amount: session.amount_total / 100, // Poisha to BDT
      currency: session.currency.toUpperCase(),
      payment_gateway: "stripe",
      status: paymentStatus,
      payment_time: new Date(),
    });

    res.status(200).json({ message: "Stripe payment attempt saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
