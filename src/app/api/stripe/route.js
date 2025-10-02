import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, customer_email , parcelId} = body;

    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Parcel Payment" },
            unit_amount: parseInt(amount) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/paymentsystem/success?parcelId=${parcelId}`,
      cancel_url: "http://localhost:3000/paymentsystem/cancel",
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

