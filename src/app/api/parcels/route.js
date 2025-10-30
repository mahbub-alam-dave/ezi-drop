import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { addNotification } from "@/lib/notificationHandler";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { NextResponse } from "next/server";

// helper function to generate unique parcelId
function generateParcelId() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `EziDrop${timestamp}${randomStr}`;
}

function calculateCost(parcelData) {
  const { pickupDistrict, deliveryDistrict, parcelType, weight } = parcelData;
  let baseCost = 0;
  if (
    pickupDistrict === deliveryDistrict &&
    parcelType === "Documents" &&
    weight <= 5
  ) {
    baseCost += 60;
  } else {
    baseCost = pickupDistrict === deliveryDistrict ? 60 : 120;
    if (weight <= 5) baseCost += 0;
    else if (weight <= 15) baseCost += 40;
    else if (weight <= 30) baseCost += 80;
    else baseCost += 100;
  }
  return baseCost;
}


// Get Data
export async function GET() {
  const collection = dbConnect("parcels");
  const parcels = await collection.find().toArray();
  return new Response(
    JSON.stringify({ success: true, data: parcels }, null, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// POST (save parcel data)
export async function POST(request) {
  try {
    const body = await request.json(); // form data
    const collection = dbConnect("parcels");
    const session = await getServerSession(authOptions)
    const users = dbConnect("users");

    const user = await users.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    let amount = calculateCost(body);
    let discountApplied = 0;
    let pointsUsed = 0;

    // Step 2️⃣ Apply points discount only for domestic service
    if (body.shipmentType === "domestic" && body.usePoints === true) {
      const userPoints = user.points || 0;

      if (userPoints > 0) {
        // each point = 1% discount, capped at 100%
        const discountPercent = Math.min(userPoints, 100);
        discountApplied = (amount * discountPercent) / 100;
        amount = amount - discountApplied;

        // Deduct only points used (1 point per 1% discount)
        pointsUsed = discountPercent;

        await users.updateOne(
          { email: session?.user?.email },
          { $inc: { points: -pointsUsed } }
        );
      }
    }

    const newParcel = {
      ...body,
      userId: session?.user?.userId,
      payment: "not_paid",
      baseAmount: amount,
      amount,
      discountApplied,
      pointsUsed,
      currency: "bdt",
      status: "not_picked",
      parcelId: generateParcelId(), // unique parcel ID
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newParcel);

const message = `Congratulations! for booking with us <a href="${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/dashboard/user/my-bookings" target="_blank" style="color: #2563eb; text-decoration: underline;">View details </a>`;
const userId = session?.user?.userId;
await addNotification({userId, message });

    return NextResponse.json(
      {
        message: "Parcel saved successfully",
        id: result.insertedId,
        parcelId: newParcel.parcelId, // return generated ID
        amount,
        discountApplied,
        pointsUsed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving parcel:", error);
    return NextResponse.json(
      { message: "Failed to save parcel", error },
      { status: 500 }
    );
  }
}
