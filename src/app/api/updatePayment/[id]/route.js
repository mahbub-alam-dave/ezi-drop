import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const collection = dbConnect("parcels");
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { payment: "done", paymentAt: new Date() } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Payment status updated" });
    } else {
      return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
