import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const id = (await params)?.id; 
    const { status } = await req.json();

    const collection = dbConnect("rider-applications");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
