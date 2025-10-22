import { collectionNames, dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const db = dbConnect(collectionNames.users);

    const user = await db.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ emailVerified: user.emailVerified });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to check user" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const session = await getServerSession()

    const db = dbConnect(collectionNames.users);

    const user = await db.findOne({ email: session?.user?.email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const userData = {
      name: user.name,
      email: user.email,
      district: user.district || null,
      districtId: user.districtId || null,
      points: user.points || 0
    }

    return NextResponse.json({ userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to check user" }, { status: 500 });
  }
}

