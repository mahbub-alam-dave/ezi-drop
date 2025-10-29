import { dbConnect } from "@/lib/dbConnect";
// GET Data
export async function GET() {
  const collection = dbConnect("rider-applications");
  const riders = await collection.find().toArray();
  return new Response(
    JSON.stringify({ success: true, data: riders }, null, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}


