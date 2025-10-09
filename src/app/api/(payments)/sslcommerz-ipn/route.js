import { dbConnect } from "@/lib/dbConnect";

// /api/sslcommerz-ipn.js
export async function POST(req) {
    console.log("ssl commerz ipn function calling")
  const ipnData = await req.json(); // or form data
  console.log("ipn data", ipnData)
  if (ipnData.status === "VALID" || ipnData.status === "SUCCESS") {
    const parcelId = ipnData.value_a; // your parcelId
    await dbConnect("parcels").updateOne(
      { parcelId },
      { $set: { payment: "paid", paymentDate: new Date() } }
    );
  }
  return new Response("OK", { status: 200 });
}
