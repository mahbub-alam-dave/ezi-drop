import { dbConnect } from "@/lib/dbConnect";


export async function POST(req) {
  try {
    const body = await req.json(); //  data  from form 
    const collection = dbConnect("rider-applications"); // riders collection used
    const result = await collection.insertOne(body);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
