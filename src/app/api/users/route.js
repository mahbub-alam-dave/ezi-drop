import { NextResponse } from "next/server";
import { collectionNames, dbConnect } from "@/lib/dbConnect";


export async function GET({req}) {

  const {email:userEmail} = req.json()

  const db = dbConnect(collectionNames.users);
  const user = await db.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
