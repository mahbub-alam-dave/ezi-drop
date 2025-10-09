import { dbConnect } from "@/lib/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {customer_email , parcelId} = body;

    const parcel = await dbConnect("parcels").findOne({ parcelId });
    const verifiedAmount = parcel.amount;

    console.log(parcelId, verifiedAmount)

    const amountInPoisha = Math.round(Number(verifiedAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: "Parcel Payment" },
            unit_amount: amountInPoisha,
          },
          quantity: 1,
        },
      ],
            // ✅ Add parcel ID as metadata
      metadata: {
        parcelId: parcelId,
        transactionId: "TRAN_" + new Date().getTime(), // ✅ Better naming
      },
      success_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/success?parcelId=${parcelId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

