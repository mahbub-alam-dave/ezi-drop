import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const referralCollection = dbConnect("referraluser");

    // user finding
    const refUser = await referralCollection.findOne({ referredEmail: email });

    if (!refUser) {
      return NextResponse.json({
        success: true,
        message: "User is not a referred person",
        referred: false,
      });
    }

    // jointime
    const currentTime = new Date();

    // status update
    let status = "after-time";
    let refererpoint = 0;
    let refereduserpoint = 0;

    if (currentTime <= new Date(refUser.expireDate)) {
      status = "in-time";
      refererpoint = 50;
      refereduserpoint = 100;
    }

    // update document
    const updated = await referralCollection.updateOne(
      { _id: refUser._id },
      {
        $set: {
          jointime: currentTime,
          status: status,
          refererpoint: refererpoint,
          refereduserpoint: refereduserpoint,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "User is a referred person",
      referred: true,
      updatedFields: {
        jointime: currentTime,
        status,
        refererpoint,
        refereduserpoint,
      },
    });
  } catch (error) {
    console.error("Error checking referral:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
