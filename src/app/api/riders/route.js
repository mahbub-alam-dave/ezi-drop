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
// POST Data
export async function POST(req) {
  try {
    const body = await req.json(); //  data  from form
    const collection = dbConnect("rider-applications"); // riders collection used

    // default workstatus add 
    const riderData = {
      ...body,
      workstatus: "active", // default value
    };

    const result = await collection.insertOne(riderData);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}

