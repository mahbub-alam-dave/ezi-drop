import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"

export async function GET(req) {
  try {
    // 1.take Logged-in user session 
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const email = session.user.email; 
    // login user email

    // 2. payment data from MongoDB 
    const payments = await dbConnect("parcelPayment")
      .find({ email })
      .sort({ payment_time: -1 })
      .toArray();

    // 3. return data
    return new Response(JSON.stringify({ payments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
