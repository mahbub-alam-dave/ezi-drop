import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// 📦 GET — Fetch performance data
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

// 🧪 POST — Seed mock data (optional)
export async function POST() {
  try {
    const collection = await dbConnect("performance");

    const sampleData = {
      totalDeliveries: 180,
      successfulDeliveries: 150,
      totalPoints: 4200,
      ratings: [4, 5, 5, 3, 4, 5],
      monthly: [
        { month: "Jan", deliveries: 40, success: 35, points: 900 },
        { month: "Feb", deliveries: 30, success: 28, points: 700 },
        { month: "Mar", deliveries: 35, success: 33, points: 820 },
        { month: "Apr", deliveries: 25, success: 22, points: 620 },
        { month: "May", deliveries: 50, success: 45, points: 1160 },
      ],
    };

    const inserted = await collection.insertOne(sampleData);

    return NextResponse.json({
      success: true,
      message: "Sample performance data inserted!",
      id: inserted.insertedId,
    });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
