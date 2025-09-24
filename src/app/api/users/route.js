import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect, collectionNames } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await dbConnect(collectionNames.users);
  const user = await db.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
