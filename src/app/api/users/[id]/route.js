import { collectionNames, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET single user by ID
export const GET = async (req, { params }) => {
  try {
    const { id } = params;
    const user = await dbConnect(collectionNames.users).findOne({ _id: new ObjectId(id) });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
};

// PATCH: update working_status
export const PATCH = async (req, { params }) => {
  try {
    const { id } = params;
    const { working_status } = await req.json();

    const result = await dbConnect(collectionNames.users).updateOne(
      { _id: new ObjectId(id) },
      { $set: { working_status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User not found or status not changed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, working_status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
};
