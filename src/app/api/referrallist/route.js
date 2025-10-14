

import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const refCollection = dbConnect("referraluser");

    const referrals = await refCollection
      .find({ referrerEmail: session.user.email })
      .sort({ referDate: -1 })
      .toArray();

    const now = new Date();
    // const now = new Date("2025-12-18T11:30:15.539Z"); testting hard coded
    const updatedReferrals = referrals.map((r) => {
      const daysPassed = Math.floor((now - new Date(r.referDate)) / (1000 * 60 * 60 * 24));
      let dateLeft = 30 - daysPassed;
      let dateOver = 0;
      if (dateLeft < 0) {
        dateOver = Math.abs(dateLeft);
        dateLeft = 0;
      }
      return { ...r, dateLeft, dateOver };
    });

    return new Response(JSON.stringify(updatedReferrals), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}








