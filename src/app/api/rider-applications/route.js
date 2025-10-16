import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = dbConnect("rider-applications");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching rider applications:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
