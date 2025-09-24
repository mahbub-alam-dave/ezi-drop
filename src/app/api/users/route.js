import { NextResponse } from "next/server";
import { collectionNames, dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET({response}) {

  const {email:userEmail} = response.json()

  const db = dbConnect(collectionNames.users);
  const user = await db.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
