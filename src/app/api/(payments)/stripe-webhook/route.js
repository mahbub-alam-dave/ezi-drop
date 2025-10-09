import Stripe from "stripe";
import { dbConnect } from "@/lib/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const config = {
  api: {
    bodyParser: false, // ❗ Disable body parsing
  },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const payload = await req.text(); // must use raw text

  console.log("✅ Stripe webhook request received!");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("🔔 Webhook received:", sig);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const parcelId = session.metadata?.parcelId;
      const transactionId = session.metadata?.transactionId;

      console.log("✅ Webhook received for parcel:", parcelId);

      const db = dbConnect("parcels");
      await db.updateOne(
        { parcelId },
        { $set: { payment: "done", transactionId, paymentDate: new Date() } }
      );

      console.log(`💰 Payment marked as paid for parcel ${parcelId}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("⚠️ Error processing webhook:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
