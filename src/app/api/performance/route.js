import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// ✅ GET - fetch performance data
export async function GET() {
  console.log("✅ /api/performance route called!");
  try {
    const collection = await dbConnect("performance");
    const data = await collection.find({}).toArray();
    console.log("✅ Data found:", data.length);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

