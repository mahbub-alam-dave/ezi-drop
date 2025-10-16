import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// ✅ GET all or filtered rider applications
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || ""; // Optional filter

    const collection = dbConnect("rider-applications");

    let query = {};

    // 🧠 যদি search থাকে, তাহলে name বা email দিয়ে ফিল্টার করো
    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: "i" } },
        { applicantEmail: { $regex: search, $options: "i" } },
      ];
    }

    // 🧠 যদি status ফিল্টার দেওয়া থাকে (Pending, Accepted, Rejected)
    if (status) {
      query.status = status;
    }

    const data = await collection.find(query).sort({ _id: -1 }).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching rider applications:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
