import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await dbConnect("performance");
    const performanceData = await collection.find({}).toArray();

    return NextResponse.json({ success: true, data: performanceData });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}