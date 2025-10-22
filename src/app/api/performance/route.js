// import { dbConnect } from "@/lib/dbConnect";
// import { NextResponse } from "next/server";

// // ✅ GET - fetch performance data
// export async function GET() {
//   console.log("✅ /api/performance route called!");
//   try {
//     const collection = await dbConnect("performance");
//     const data = await collection.find({}).toArray();
//     // console.log("✅ Data found:", data.length);
//     return NextResponse.json({ success: true, data });
//   } catch (err) {
//     console.error("DB Error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }

// // ✅ POST - seed sample data if needed
// export async function POST() {
//   try {
//     const collection = await dbConnect("performance");

//     const sampleData = {
//       totalDeliveries: 180,
//       successfulDeliveries: 150,
//       totalPoints: 4200,
//       ratings: [4, 5, 5, 3, 4, 5],
//       monthly: [
//         { month: "Jan", deliveries: 40, success: 35, points: 900 },
//         { month: "Feb", deliveries: 30, success: 28, points: 700 },
//         { month: "Mar", deliveries: 35, success: 33, points: 820 },
//         { month: "Apr", deliveries: 25, success: 22, points: 620 },
//         { month: "May", deliveries: 50, success: 45, points: 1160 },
//       ],
//     };

//     const inserted = await collection.insertOne(sampleData);

//     return NextResponse.json({
//       success: true,
//       message: "Sample performance data inserted!",
//       id: inserted.insertedId,
//     });
//   } catch (err) {
//     console.error("DB Error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }
