import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { hashOtp } from "@/lib/otp";

export async function PATCH(req, { params }) {
  const { parcelId } = params;

  const parcels = dbConnect("parcels");

  const { secretCode } = await req.json(); // ✅ secret code from rider input


  const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });
  if (!parcel)
    return NextResponse.json({ error: "Parcel not found" }, { status: 404 });

  const hashedInput = hashOtp(secretCode);

    console.log(hashedInput, parcel.secretCodeHash)

  // ✅ Check if secret code matches
  if (parcel.secretCodeHash !== hashedInput) {
    return NextResponse.json({ success: false, message: "Invalid secret code" }, { status: 400 });
  }

  // ✅ Update status if matched
  await parcels.updateOne(
    { _id: new ObjectId(parcelId) },
    {
      $set: {
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true, message: "Parcel marked as completed" });
}
