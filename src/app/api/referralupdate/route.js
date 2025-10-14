



import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    const refCollection = dbConnect("referraluser");
    const userCollection = dbConnect("users"); // if user data is here

    // ---------------- Referral Data finding ----------------
    const referral = await refCollection.findOne({ referredEmail: email });

    if (!referral) {
      return new Response(
        JSON.stringify({ message: "No referral found for this email" }),
        { status: 404 }
      );
    }

    const now = new Date();
    const isBeforeExpire = now <= new Date(referral.expireDate);

    let updatedStatus = "";
    let referredPoints = 0;
    let referrerPoints = 0;

    if (isBeforeExpire) {
      updatedStatus = "joined-in-time";
      referredPoints = 100;
      referrerPoints = 50;
    } else {
      updatedStatus = "joined-after-time";
      referredPoints = 0;
      referrerPoints = 0;
    }

    // ---------------- Referral collection update ----------------
    await refCollection.updateOne(
      { referredEmail: email },
      {
        $set: {
          status: updatedStatus,
          joinedAt: now,
          referredPoints,
          referrerPoints,
        },
      }
    );

    // ---------------- User point update ----------------
    // referred user
    await userCollection.updateOne(
      { email },
      { $inc: { points: referredPoints } },
      { upsert: true }
    );

    // referrer user
    await userCollection.updateOne(
      { email: referral.referrerEmail },
      { $inc: { points: referrerPoints } },
      { upsert: true }
    );

    return new Response(
      JSON.stringify({
        message: "Referral status updated successfully",
        data: {
          referredEmail: email,
          referrerEmail: referral.referrerEmail,
          status: updatedStatus,
          referredPoints,
          referrerPoints,
          joinedAt: now,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating referral:", err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
